from django.shortcuts import render
from rest_framework import viewsets
from .models import Todolist
from .serializers import TodolistSerializer

# Create your views here.


class TodolistViewSet(viewsets.ModelViewSet):
    queryset = Todolist.objects.all()
    serializer_class = TodolistSerializer


