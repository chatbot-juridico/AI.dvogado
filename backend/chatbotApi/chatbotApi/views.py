from rest_framework import viewsets
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from .serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        password = self.request.data.get('password')
        hashed_password = make_password(password)
        serializer.save(password=hashed_password)