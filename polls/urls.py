from django.urls import path

from . import views

app_name = 'polls'

urlpatterns = [
    path('', views.index, name='index'),
    path('detail/', views.detail, name='detail'),
    path('observe/', views.observe, name='name'),
    path('signup/', views.SignUpView.as_view(), name='signup'),

]
