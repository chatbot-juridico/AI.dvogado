from django.db import models
from django.contrib.auth.models import User


class Chat(models.Model):
    title = models.TextField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.title


class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    content = models.TextField()

    def __str__(self):
        return self.content[0:50] + "..."
