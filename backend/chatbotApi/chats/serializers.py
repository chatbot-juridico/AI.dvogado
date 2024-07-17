from rest_framework import serializers
from django.core import serializers as ser
from .models import Chat, Message
from django.contrib.auth.models import User
from django.http import JsonResponse
from .endpoint import bot_response_api
import json


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "chat", "user", "content"]

    def create(self, request):
        if request.get("user").id != 1:
            new_message = super().create(request)
            return new_message
        else:
            chat = request.get("chat")
            queryset = Message.objects.filter(chat=chat)
            message_history = ser.serialize("json", queryset)
            data = json.loads(message_history)
            parsed_messages = []
            for message in data:
                content = message["fields"]["content"]
                parsed_messages.append(content)

            # endpoint = "jumpstart-dft-hf-llm-llama-3-8b-ins-20240717-013134"
            endpoint = "jumpstart-dft-hf-llm-mistral-7b-ins-20240717-005230"
            bot_message = bot_response_api(parsed_messages, endpoint)

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
