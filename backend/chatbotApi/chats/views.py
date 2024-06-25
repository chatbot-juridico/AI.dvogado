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
    
    def get_queryset(self):
        queryset = Message.objects.all()
        user_id = self.request.query_params.get('user', None)
        chat_id = self.request.query_params.get('chat', None)
        last_id = self.request.query_params.get('last', None)
        
        if user_id is not None:
            queryset = queryset.filter(user=user_id)
        
        if chat_id is not None:
            queryset = queryset.filter(chat=chat_id)
            
        if last_id == '1':
            queryset = queryset.order_by('-id')
            queryset = queryset.filter(id=queryset[0].id)
            
        return queryset


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
