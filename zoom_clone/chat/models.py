from django.db import models

class ChatMessage(models.Model):
    username = models.CharField(max_length=50)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username}: {self.message[:20]}"


# chat/models.py

from django.db import models

class Meeting(models.Model):
    username = models.CharField(max_length=150)
    datetime = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} - {self.datetime}"
