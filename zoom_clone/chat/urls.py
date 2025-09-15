from django.urls import path
from .views import *
from . import views

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login_view,name='signup'),
    path('schedule/', ScheduleMeetingAPIView.as_view(), name='schedule_meeting'),
    path('meetings/', views.meetings_list, name='meetings-list'),
    path('meetings/<int:pk>/', views.meeting_detail, name='meeting-detail'),
]
