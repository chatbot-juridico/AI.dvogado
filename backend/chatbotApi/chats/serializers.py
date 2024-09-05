from rest_framework import serializers
from django.core import serializers as ser
from .models import Chat, Message
from django.contrib.auth.models import User
from django.http import JsonResponse
from .endpoint import bot_response_api
import json
import os


class MessageSerializer(serializers.ModelSerializer):

    endpoint = serializers.CharField(write_only=True, required=False)
    class Meta:
        model = Message
        fields = ["id", "chat", "user", "content", "endpoint"]

    def to_internal_value(self, data):
        endpoint = data.pop('endpoint', None)
        validated = super().to_internal_value(data)
        validated['endpoint'] = endpoint
        return validated

    def create(self, validated):
        endpoint = validated.pop('endpoint', None)
        if validated.get("user").id != 1:
            new_message = super().create(validated)
            return new_message
        else:
            chat = validated.get("chat")
            queryset = Message.objects.filter(chat=chat)
            message_history = ser.serialize("json", queryset)
            data = json.loads(message_history)
            parsed_messages = []
            user_bot = 0;
            for message in data:
                if user_bot == 0:
                    user="USER"
                    user_bot = 1
                else:
                    user="BOT"
                    user_bot = 0
                    
                content = user+": "+message["fields"]["content"]
                parsed_messages.append(content)

            if endpoint == "mistral":
                endpoint_name = "" #URL para endpoint do deploy do Mistral AI
            else:
                endpoint_name = "" #URL para endpoit do deploy do LLama3 8B Gradient
            
            bot_message = bot_response_api(parsed_messages, endpoint_name, endpoint)

            bot_response = {
                "chat": validated.get("chat"),
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
