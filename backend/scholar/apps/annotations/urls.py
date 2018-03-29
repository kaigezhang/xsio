from django.conf.urls import url, include
from rest_framework.routers import SimpleRouter

from scholar.apps.posts.views import CommentViewSet
from .views import AnnotationViewSet, AnnotationFavoriteAPIView

r = SimpleRouter(trailing_slash=False)

r.register(r'annotations', AnnotationViewSet, 'annotation')


urlpatterns = [
    url(r'^', include(r.urls)),
    url(r'^annotations/(?P<annotation_pk>[^/.]+)/favorite',
        AnnotationFavoriteAPIView.as_view(), name='annotation-favorite'),
    url(r'^annotations/(?P<annotation_pk>[^/.]+)/comments',
        CommentViewSet.as_view({
            'get': 'list',
            'post': 'create',
        }), name='annotation-comments'),
    # url(r'^annotations/(?P<annotation_pk>[^/.]+)/relationships/(?P<related_field>\w+)',
    #     AnnotationFavoriteAPIView.as_view(), name='annotation-relationships'),
]