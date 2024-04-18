from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer


class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer


class AllChatsWithMessagesView(APIView):
    def get(self, request):
        user_id = request.query_params.get("user_id")
        chats = Chat.objects.filter(user_id=user_id)
        serialized_chats = []

        for chat in chats:
            serialized_chat = ChatSerializer(chat, context={"request": request}).data
            messages = chat.message_set.all()
            serialized_messages = []

            for message in messages:
                serialized_message = MessageSerializer(
                    message, context={"request": request}
                ).data
                serialized_messages.append(serialized_message)

            serialized_chat["messages"] = serialized_messages
            serialized_chats.append(serialized_chat)

        return Response(serialized_chats)
