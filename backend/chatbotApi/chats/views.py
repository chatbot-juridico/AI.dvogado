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
        serialized_data = []

        for chat in chats:
            chat_data = ChatSerializer(chat, context={"request": request}).data
            messages = MessageSerializer(
                chat.message_set.all(), many=True, context={"request": request}
            ).data
            chat_data["messages"] = [
                {"id": msg["id"], "user": msg["user"], "content": msg["content"]}
                for msg in messages
            ]
            serialized_data.append(chat_data)

        return Response(serialized_data)
