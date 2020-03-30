from django.urls import path

from . import views

app_name = 'polls'

urlpatterns = [
    path('', views.index, name='index'),
    path('detail/', views.detail, name='detail'),
    path('observe/', views.observe, name='name'),
    path('signup/', views.SignUpView.as_view(), name='signup'),
    path('mapall/', views.map_view, name='map'),
    path('points_view/', views.points_view, name='points_view'),
    path('points/', views.pointstest, name='points'),

]
