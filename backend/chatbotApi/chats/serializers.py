from rest_framework import serializers
from .models import Chat, Message
from django.contrib.auth.models import User
from .endpoint import bot_response_api


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "chat", "user", "content"]

    def create(self, request):
        if request.get('user').id != 1:
            new_message = super().create(request)
            return new_message
        else:
            user_message = request.get("content")
            bot_message = bot_response_api(user_message)

            bot_response = {
                "chat": request.get("chat"),
                "user": User.objects.get(id=1),
                "content": bot_message,
            }
            response = super().create(bot_response)
            return response



class ChatSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = ["id", "title", "user", "messages"]
