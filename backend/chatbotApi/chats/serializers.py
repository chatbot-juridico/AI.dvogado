from rest_framework import serializers
from .models import Chat, Message
from transformers import pipeline
from django.contrib.auth.models import User


class MessageSerializer(serializers.ModelSerializer):

    text_generator = pipeline("text-generation", model="gpt2")

    class Meta:
        model = Message
        fields = ["id", "chat", "user", "content"]

    def get_bot_response(self, message):
        generated_text = self.text_generator(
            message, max_length=500, num_return_sequences=1
        )
        return generated_text[0]["generated_text"]

    def create(self, request):
        new_message = super().create(request)

        user_message = request.get("content")
        bot_message = self.get_bot_response(user_message)

        bot_response = {
            "chat": request.get("chat"),
            "user": User.objects.get(id=1),
            "content": bot_message,
        }
        super().create(bot_response)

        return new_message


class ChatSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = ["id", "title", "user", "messages"]
