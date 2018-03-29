from rest_framework.routers import SimpleRouter
from scholar.apps.papers import views
from django.conf.urls import url, include
from scholar.apps.annotations.views import AnnotationViewSet

r = SimpleRouter(trailing_slash=False)

r.register(r'libraries', views.LibraryViewSet, 'library')
r.register(r'papers', views.PaperViewset, 'article')
r.register(r'files', views.FileViewset, 'file')

urlpatterns = [
    url(r'^', include(r.urls)),
    url(r'^files/(?P<file_pk>[^/.]+)/annotations',
        AnnotationViewSet.as_view({'get': 'list', 'post': 'create'}), name='file-annotations'),
    url(r'^libraries/(?P<library_pk>[^/.]+)/files', views.FileViewset.as_view({'get': 'list', 'post': 'create'}),
        name="library-files")

]
