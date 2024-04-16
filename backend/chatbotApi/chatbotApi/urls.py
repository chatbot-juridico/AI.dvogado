from django.urls import include, path
from rest_framework import routers
from rest_framework.authtoken.views import ObtainAuthToken
from chat.views import ChatViewSet

from .views import UserDetailsView, UserViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'chat', ChatViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api-auth/login/', ObtainAuthToken.as_view(), name='api-token-auth'),

    path('api/user-details/', UserDetailsView.as_view({'post': 'user_details'}), name='user-details'),
]
