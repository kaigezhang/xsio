from django.conf.urls import url, include
from rest_framework.routers import SimpleRouter

from scholar.apps.posts import views

router = SimpleRouter(trailing_slash=False)
router.register(r'posts', views.PostViewSet, 'posts')
router.register(r'comments', views.CommentViewSet, 'comments')

urlpatterns= [
    url(r'^', include(router.urls)),
    url(r'^posts/(?P<post_pk>[^/.]+)/suggested/', views.PostViewSet.as_view({'get': 'list'}), name='post-suggested'),
    # url(r'^posts/(?P<pk>[^/.]+)/relationships/(?P<related_field>\w+)', views.PostRelationshipView, name='post-relationships'),
]