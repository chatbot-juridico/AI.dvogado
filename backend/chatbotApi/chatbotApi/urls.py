from django.urls import include, path
from rest_framework import routers
from rest_framework.authtoken.views import ObtainAuthToken

from .views import UserDetailsView, UserViewSet
from chats.views import ChatViewSet, MessageViewSet, AllChatsWithMessagesView
from feedbacks.views import FeedbackViewSet

router = routers.DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"chats", ChatViewSet)
router.register(r"messages", MessageViewSet)
router.register(r"feedbacks", FeedbackViewSet)

urlpatterns = [
    path("api/", include(router.urls)),
    path("api-auth/login/", ObtainAuthToken.as_view(), name="api-token-auth"),
    path(
        "api/user-details/",
        UserDetailsView.as_view({"post": "user_details"}),
        name="user-details",
    ),
    path(
        "api/chats-messages/", AllChatsWithMessagesView.as_view(), name="chats-messages"
    ),
]
