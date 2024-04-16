from django.db import models
from django.contrib.auth.models import User

class Chat(models.Model):
    text = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.text[0:10] + '...'
