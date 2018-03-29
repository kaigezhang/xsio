from rest_framework import status, generics
from rest_framework.decorators import detail_route
from django.db.models import Q
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_json_api.views import ModelViewSet

from scholar.apps.posts.models import Comment
from scholar.apps.posts.serializers import CommentSerializer
from scholar.apps.profiles.models import Profile
from .models import Annotation, Channel
from .serializers import AnnotationSerializer, ChannelSerializer


class ChannelViewSet(ModelViewSet):
    serializer_class = ChannelSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self, *args, **kwargs):
        queryset = Channel.objects.filter(public=True)
        user = self.request.user
        if user.is_authenticated():
            profile = user.profile
            user_query = Channel.objects.filter(owner_id=profile.id)
            queryset = queryset.union(user_query)
        if 'file_pk' in self.kwargs:
            file_pk = self.kwargs['file_pk']
            queryset = queryset.filter(file__pk=file_pk)
        if 'username' in self.kwargs:
            username = self.kwargs['username']
            profile = Profile.objects.get(user__username=username)
            queryset = Channel.objects.filter(author__pk=profile.pk)
        return queryset


class ChannelJoinViewSet():
    pass


class AnnotationViewSet(ModelViewSet):
    serializer_class = AnnotationSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    prefetch_for_includes = {
        '__all__': [],
        'author': ['author']
    }

    def get_queryset(self):
        queryset = Annotation.objects.all()
        user = self.request.user
        if user.is_authenticated():
            profile = user.profile
            queryset = queryset.filter(
                Q(author_id=profile.id) | Q(public=True))
        else:
            queryset = queryset.filter(public=True)
        if 'file_pk' in self.kwargs:
            file_pk = self.kwargs['file_pk']
            queryset = queryset.filter(file__pk=file_pk)
        if 'username' in self.kwargs:
            username = self.kwargs['username']
            profile = Profile.objects.get(user__username=username)
            queryset = Annotation.objects.filter(author__pk=profile.pk)
        # queryset = self.serializer_class.setup_eager_loading(queryset)
        return queryset

    def create(self, request, file_pk=None):
        annotation = self.request.data
        # tags = annotation.pop('tags', [])
        # print('tags {}'.format(tags))
        serializer = self.serializer_class(data=annotation, context={
                                           'request': request, 'file_pk': file_pk})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AnnotationFavoriteAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = AnnotationSerializer

    def delete(self, request, annotation_pk=None):
        profile = request.user.profile

        try:
            annotation = Annotation.objects.get(pk=annotation_pk)
        except Annotation.DoesNotExist:
            raise NotFound('Annotation was not found.')

        profile.favorites.remove(annotation)

        serializer = self.serializer_class(annotation, context={
            'request': request
        })

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, annotation_pk=None):
        profile = request.user.profile

        try:
            annotation = Annotation.objects.get(pk=annotation_pk)
        except Annotation.DoesNotExist:
            raise NotFound('Annotation was not found.')

        profile.favorites.add(annotation)

        serializer = self.serializer_class(annotation, context={
            'request': request
        })

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AnnotationRelationshipsViewSet(ModelViewSet):
    queryset = Annotation.objects.all()
