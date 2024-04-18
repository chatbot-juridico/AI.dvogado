from rest_framework import serializers
from .models import Chat, Message
from transformers import pipeline #Lib de utilização externa do modelo no Huggingface

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "chat", "user", "content"]  # Remove 'response_text' from fields

    def create(self, validated_data):
        # Carrega o modelo pra utilização na conversa
        text_generator = pipeline("text-generation", model="gpt2")
        
        # Pega a mensagem do usuário pra registrar no banco
        user_message = validated_data.get('content', '')  # Assuming 'content' is the field containing the user message

        # Acessa o modelo pra enviar a mensagem
        generated_text = text_generator(user_message, max_length=500, num_return_sequences=1)

        # Extrai a resposta
        response_text = generated_text[0]['generated_text']

        # Cria instancia da mensagem
        instance = super().create(validated_data)

        # Adiciona a resposta no pacote de response HTTP
        instance.response_text = response_text

        return instance

    # Alterações no pacote padrão de response HTTP
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['response_text'] = instance.response_text
        return representation

class ChatSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = ["id", "title", "user", "messages"]
