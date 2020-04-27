from django.urls import path

from . import views

app_name = 'polls'

urlpatterns = [
    path('detail/', views.detail, name='detail'),
    path('observe/', views.observe, name='name'),
    path('signup/', views.SignUpView.as_view(), name='signup'),
    path('allObs/', views.all_obs, name='map'),
    path('userInfo/', views.userTest, name='userInfo'),
    path('myObs/', views.my_obs, name='obs'),
    path('ftest/', views.test, name='ftest'),
]
