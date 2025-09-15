from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/chat/", consumers.ChatConsumer.as_asgi()),
    path("ws/video/<str:room_name>/", consumers.VideoConsumer.as_asgi()),
]
