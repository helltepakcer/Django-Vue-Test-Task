from rest_framework import routers
from .views import TodolistViewSet

router = routers.DefaultRouter()
router.register('todolist', TodolistViewSet)

urlpatterns = router.urls