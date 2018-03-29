import hashlib
import os

from django.conf import settings
from django.http import FileResponse
from rest_framework import status
from rest_framework.decorators import detail_route
from rest_framework.exceptions import NotFound, AuthenticationFailed
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework_json_api.views import ModelViewSet

from .models import Paper, File, Library
from .serializers import PaperSerializer, FileSerializer, LibrarySerializer
from .tasks import pdf_read
# from .upload import get_token

class LibraryViewSet(ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = LibrarySerializer
    resource_name = 'libraries'
    prefetch_for_includes = {
        '__all__': [],
        'files': ['files']
    }

    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        if user.is_anonymous():
            raise NotAuthenticated('You need authenticated')
        creator = user.profile
        queryset = Library.objects.filter(creator__pk=creator.pk)

        return queryset

    def create(self, request):
        context = {
            'creator': request.user.profile,
        }
        data = request.data
        serializer = self.serializer_class(data=data, context=context)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PaperViewset(ModelViewSet):
    serializer_class = PaperSerializer
    queryset = Paper.objects.all()

    # def get_queryset(self):
    #   return Paper.objects.all()


class FileViewset(ModelViewSet):
    serializer_class = FileSerializer
    parser_classes = (
        MultiPartParser,
    )
    permission_classes = (IsAuthenticated,)
    prefetch_for_includes = {
        '__all__': [],
        'paper': ['paper']
    }

    def get_queryset(self, *args, **kwargs):
        queryset = File.objects.all()
        user = self.request.user
        if user.is_anonymous():
            raise AuthenticationFailed('You need login to see you files')
        profile = user.profile
        queryset = queryset.filter(owned_by__id=profile.id)
        if 'library_pk' in self.kwargs:
            library_pk = self.kwargs['library_pk']
            queryset = queryset.filter(libraries__pk=library_pk)
        return queryset.prefetch_related('annotations')
    def create(self, request, library_pk=None):
        user = request.user
        if user.is_anonymous():
            raise AuthenticationFailed('You need login to see you files')
        if library_pk is None:
            raise NotFound('Library not found')

        library = Library.objects.get(pk=library_pk)
        profile = user.profile
        uploaded_files = request.data.getlist('files')

        file_names = [f._name for f in uploaded_files]
        blobs = [f.read() for f in uploaded_files]
        # 以后要做客户端检测，通过客户端发送md5实现秒级上传
        file_hashes = [hashlib.md5(blob).hexdigest() for blob in blobs]
        res = []
        for file, file_hash, file_name in zip(uploaded_files, file_hashes, file_names):
            uploaded_path = os.path.join(settings.MEDIA_ROOT, file_hash)
            if os.path.exists(uploaded_path):
                #   TODO 检测是否已经上传
                paper_file = File.objects.get(hash=file_hash)
                if not library.has_file(paper_file):
                    library.add(paper_file)
                if not profile.is_owning(paper_file):
                    profile.own(paper_file)
            else:
                with open(uploaded_path, 'wb+') as destination:
                  for chunk in file.chunks():
                    destination.write(chunk)
                # TODO 这里有两个方法
                # １, 通过celery来进行异步任务识别上传的文章
                # 2, 通过GET请求发送给识别服务器进行识别
                # paper = Paper.objects.get(pk=1)
                paper_file = File.objects.create(
                    hash=file_hash, name=file_name)
                library.add(paper_file)
                profile.own(paper_file)
            res.append(paper_file)
        # 利用celery 来识别文件
        pdf_read.delay(file_hashes)
        serializer = self.serializer_class(res, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @detail_route(methods=['get'], permission_classes=(AllowAny,))
    def download(self, request, pk=None):
        try:
            file = File.objects.get(pk=pk)
        except File.DoesNotExist:
            raise NotFound('File does not exists')
        file_path = os.path.join(settings.MEDIA_ROOT, file.hash)
        response = FileResponse(open(file_path, 'rb'))
        response['Content-Type'] = 'application/pdf'
        return response


# class FileRelationshipView(RelationshipView):
#     queryset = File.objects
