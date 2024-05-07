
from django.contrib import admin
from django.urls import path
from .bookStoreApp.views import *
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/book',BookListView.as_view({'get':'list'}), name='book-list'),
    path('api/book/<int:pk>/', BookListView.as_view({'get': 'retrieve'}), name='book-detail'),
    path('api/book/search/', BookListView.as_view({'get': 'search'}), name='book-search'),

]
