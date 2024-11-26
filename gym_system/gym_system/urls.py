from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('gym.urls')),  # Inclui as rotas do app 'gym'
]