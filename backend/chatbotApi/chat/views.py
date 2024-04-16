from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response

from .models import Chat
from django.contrib.auth.models import User

from .serializers import ChatSerializer


class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer

    def create(self, request, *args, **kwargs):
        try:
            if request.data["user"]:
                user = User.objects.get(id=1)  # Bot
            else:
                username = request.user.username  # Logado na API
                user = user = User.objects.get(username=username)
        except:
            user = None

        chat = Chat.objects.create(text=request.data["text"], user=user)
        serializer = self.get_serializer(chat)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
