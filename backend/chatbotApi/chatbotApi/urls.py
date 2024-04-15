from django.urls import include, path
from rest_framework import routers
from rest_framework.authtoken.views import ObtainAuthToken

from .views import UserViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api-auth/login/', ObtainAuthToken.as_view(), name='api-token-auth'),
]
