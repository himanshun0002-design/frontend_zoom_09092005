import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = "global_chat"
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message")
        username = data.get("username", "Anonymous")

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "username": username
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "username": event["username"]
        }))


class VideoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'video_{self.room_name}'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')
        username = data.get('username', 'Anonymous')
        
        # Handle different types of WebRTC messages
        if message_type == 'offer':
            offer = data.get('offer')
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'webrtc_offer',
                    'offer': offer,
                    'username': username
                }
            )
        
        elif message_type == 'answer':
            answer = data.get('answer')
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'webrtc_answer',
                    'answer': answer,
                    'username': username
                }
            )
        
        elif message_type == 'ice':
            candidate = data.get('candidate')
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'webrtc_ice',
                    'candidate': candidate,
                    'username': username
                }
            )
        
        elif message_type == 'join':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_join',
                    'username': username
                }
            )
    
    # Handler for WebRTC offer messages
    async def webrtc_offer(self, event):
        await self.send(text_data=json.dumps({
            'type': 'offer',
            'offer': event['offer'],
            'username': event['username']
        }))
    
    # Handler for WebRTC answer messages
    async def webrtc_answer(self, event):
        await self.send(text_data=json.dumps({
            'type': 'answer',
            'answer': event['answer'],
            'username': event['username']
        }))
    
    # Handler for WebRTC ICE candidate messages
    async def webrtc_ice(self, event):
        await self.send(text_data=json.dumps({
            'type': 'ice',
            'candidate': event['candidate'],
            'username': event['username']
        }))
    
    # Handler for user join messages
    async def user_join(self, event):
        await self.send(text_data=json.dumps({
            'type': 'join',
            'username': event['username']
        }))
