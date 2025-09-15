from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User

@api_view(['POST'])
def signup(request):
    data = request.data
    full_name = data.get('fullName')
    email = data.get('email')
    password = data.get('password')

    if not full_name or not email or not password:
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=email).exists():
        return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=full_name
    )
    user.save()
    return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user:
        return Response({"message": "Login successful", "username": user.username}, status=200)
    else:
        return Response({"error": "Invalid credentials"}, status=401)


# chat/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Meeting
from .serializers import MeetingSerializer

class ScheduleMeetingAPIView(APIView):
    def post(self, request):
        serializer = MeetingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Meeting
from .serializers import MeetingSerializer

# List and create meetings
@api_view(['GET', 'POST'])
def meetings_list(request):
    if request.method == 'GET':
        meetings = Meeting.objects.all().order_by('datetime')
        serializer = MeetingSerializer(meetings, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = MeetingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Meeting

@api_view(['DELETE'])
def meeting_detail(request, pk):
    try:
        meeting = Meeting.objects.get(pk=pk)
    except Meeting.DoesNotExist:
        return Response({'error': 'Meeting not found'}, status=status.HTTP_404_NOT_FOUND)

    meeting.delete()
    return Response({'message': 'Meeting deleted successfully.'}, status=status.HTTP_200_OK)
