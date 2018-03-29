from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from .serializers import UserSerializer, LoginSerializer, RegistrationSerializer
from .models import User
from .renderers import UserJSONRenderer


class UserViewSet(ModelViewSet):
  serializer_class = UserSerializer

  resource_name = 'users'
  resource_instance = 'user'

  def get_queryset(self):
    return User.objects

  @list_route(
    methods=['post'],
    serializer_class=LoginSerializer,
    permission_classes=(AllowAny,),
    renderer_classes=(UserJSONRenderer,)
  )
  def login(self, request):
    user = self.request.data

    serializer = self.serializer_class(data=user)
    serializer.is_valid(raise_exception=True)
    data = serializer.data
    # if data and 'results' in data:
    #   serializer_data = data["results"]
    # else:
    #   serializer_data = data
    # data['serializer'] = UserSerializer(data=data)
    email = data.get('id')
    print('email: {}'.format(email))
    print('type: {}'.format(type(data)))

    # ser2 = RegistrationSerializer(data=data)
    # ser2.is_valid(raise_exception=True)
    # ser2.get()
    # print('ser2{}'.format(ser2))
    # setattr(data, 'serializer', User(email=email))
    # serializer.initial_data()
    serializer2 = getattr(data, 'serializer', None)
    print('serializer2: {}'.format(serializer2))

    return Response(serializer.data, status=status.HTTP_200_OK)
  
  @list_route(
    methods=['post'],
    permission_classes=(AllowAny,),
    serializer_class=RegistrationSerializer
  )
  def register(self, request):
    data = self.request.data
    serializer = self.serializer_class(data=data)
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response(serializer.data, status=status.HTTP_201_CREATED)

  @list_route(
      methods=['get'],
    permission_classes=(IsAuthenticated,)
  )
  def session(self, request):
    serializer = self.serializer_class(self.request.user)
    # print('serializer: {}'.format(serializer.data))
    return Response(serializer.data, status=status.HTTP_200_OK)
