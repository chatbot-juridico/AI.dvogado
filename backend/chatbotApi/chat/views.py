from rest_framework import viewsets
from .models import Chat
from .serializers import ChatSerializer
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response


class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer

    def create(self, request, *args, **kwargs):
        username = request.user.username
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            user = None

        chat = Chat.objects.create(text=request.data["text"], user=user)
        serializer = self.get_serializer(chat)

        chat_text = f"Sou o bot respondendo à pergunta: {request.data['text']}. Feita pelo usuário {username}"
        Chat.objects.create(text=chat_text, user=None)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
