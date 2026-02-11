from django.urls import path
from . import views

url patterns = [
    path("", views.index, name='index'),
]