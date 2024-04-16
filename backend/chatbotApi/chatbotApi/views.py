from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .serializers import UserSerializer


from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from .serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        password = self.request.data.get("password")
        hashed_password = make_password(password)
        serializer.save(password=hashed_password)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if password:
            instance.set_password(password)

        if username:
            instance.username = username
        if email:
            instance.email = email

        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class UserDetailsView(viewsets.ViewSet):
    @action(detail=False, methods=["post"])
    def user_details(self, request):
        auth_token = request.data.get("token", None)

        if not auth_token:
            return Response(
                {"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = Token.objects.get(key=auth_token)
            user = token.user
            serializer = UserSerializer(user, context={"request": request})
            user_data = serializer.data
            user_data["id"] = user.id
            return Response(user_data, status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
            )
