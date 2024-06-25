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
