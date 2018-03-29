from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework_json_api.views import ModelViewSet
from rest_framework.exceptions import NotAuthenticated

from .models import Document, Collection
from .serializers import DocumentSerializer, CollectionSerializer


class CollectionViewSet(ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = CollectionSerializer
    resource_name = 'collections'
    prefetch_for_includes = {
        '__all__': [],
        'documents': ['documents']
    }


    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        if user.is_anonymous():
            raise NotAuthenticated('You need authenticated')
        creator = user.profile
        queryset = Collection.objects.filter(creator__pk=creator.pk)

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


class DocumentViewSet(ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

    prefetch_for_includes = {
        '__all__': [],
        'collection': ['collection']
    }


    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        params = self.request.query_params

        if user.is_anonymous():
            raise NotAuthenticated('You need authenticated')

        queryset = Document.objects.all()

        if 'collection_pk' in self.kwargs:
            collection_pk = self.kwargs['collection_pk']
            queryset = queryset.filter(collection__pk=collection_pk)
        print('params {}'.format(params))
        type = params.get('type', None)
        limit = params.get('limit', None)

        if type is not None:
            if type == 'viewed':
                queryset = queryset.order_by('updated_at').all()
            if type == 'edited':
                queryset = queryset.order_by('created_at').all()
        return queryset

    def create(self, request, collection_pk=None):
        document = self.request.data
        # tags = annotation.pop('tags', [])
        # print('tags {}'.format(tags))
        serializer = self.serializer_class(
            data=document, context={'request': request, 'collection_pk': collection_pk})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
