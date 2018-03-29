from rest_framework.routers import SimpleRouter
from django.conf.urls import url, include

from .views import CollectionViewSet, DocumentViewSet

r = SimpleRouter(trailing_slash=False)

r.register('collections', CollectionViewSet, 'collection')
r.register('documents', DocumentViewSet, 'document')


urlpatterns = [
    url(r'^', include(r.urls)),
    url(r'^collections/(?P<collection_pk>[^/.]+)/documents',
        DocumentViewSet.as_view({'get': 'list', 'post': 'create'}), name='collection-documents'),
]