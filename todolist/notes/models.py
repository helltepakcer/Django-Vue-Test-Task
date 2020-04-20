from django.db import models

# Create your models here.


class Todolist(models.Model):
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(default=False)
