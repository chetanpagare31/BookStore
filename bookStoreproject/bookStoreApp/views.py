from django.shortcuts import render

# Create your views here.
from .serializer import *
from .models import *
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from django.core.paginator import Paginator
from django.db.models import Q 
from rest_framework import status

class BookListView(ViewSet):
    def list(self,request):
        books = Book.objects.order_by('id')

        page_number = request.GET.get('page', 1)
        page_size = request.GET.get('page_size', 10)
        paginator = Paginator(books, page_size)
        page_obj = paginator.get_page(page_number)

        
        serializer = BookSerializer(page_obj, many=True)
        print(serializer.data)
        return Response({'books': serializer.data,
            'total_pages': paginator.num_pages})


    def retrieve(self, request, pk=None):
        try:
            book = Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = BookSerializer(book)
        return Response({'book': serializer.data})
    
    def search(self, request):

        query = request.GET.get('query', '')

        if query:
            books = Book.objects.filter(
                Q(title__icontains=query) |
                Q(author__icontains=query) |
                Q(description__icontains=query)
            )
        else:
            books = Book.objects.all()

        serializer = BookSerializer(books, many=True)
        return Response({'results': serializer.data})