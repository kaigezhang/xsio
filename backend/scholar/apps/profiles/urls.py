from django.conf.urls import url

from .views import ProfileRetrieveAPIView, ProfileFollowAPIView
from scholar.apps.annotations.views import AnnotationViewSet, ChannelViewSet

urlpatterns = [
    url(r'^profiles/(?P<username>\w+)/?$', ProfileRetrieveAPIView.as_view()),
    url(r'^profiles/(?P<username>\w+)/follow/?$',
        ProfileFollowAPIView.as_view(), name='user-follow'),
    url(r'^profiles/(?P<username>[^/.]+)/annotations',
        AnnotationViewSet.as_view({'get': 'list'}), name='user-annotations'),
    url(r'^profiles/(?P<username>[^/.]+)/channels',
        ChannelViewSet.as_view({'get': 'list', 'post': 'create'}), name='user-channels'),
]
