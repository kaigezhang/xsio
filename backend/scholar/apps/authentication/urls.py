from django.conf.urls import url

from .views import (
    LoginAPIView, RegistrationAPIView, UserRetrieveUpdateAPIView,
)

urlpatterns = [
    url(r'^user/?$', UserRetrieveUpdateAPIView.as_view()),
    url(r'^users/?$', RegistrationAPIView.as_view()),
    url(r'^users/login/?$', LoginAPIView.as_view()),
]


# # from django.conf.urls import url

# from rest_framework.routers import SimpleRouter
# from .view2 import UserViewSet

# r = SimpleRouter(trailing_slash=False)

# r.register(r'users', UserViewSet, 'users')

# urlpatterns = r.urls