from django.db import models


class Feedback(models.Model):
    email = models.TextField(max_length=50)
    content = models.TextField()

    def __str__(self):
        return self.email + " - " + self.content
