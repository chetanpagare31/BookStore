# your_app/management/commands/populate_books.py

import random
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from bookStoreproject.bookStoreApp.models import Book

class Command(BaseCommand):
    help = 'Populate the database with 10,000 books'

    def handle(self, *args, **options):
        titles = [
            'Python Programming', 'JavaScript Essentials', 'Data Structures and Algorithms',
            'Machine Learning with Python', 'Web Development with Django',
            'Intro to Artificial Intelligence', 'Database Management Systems',
            'Network Security', 'Java Programming', 'C++ for Beginners',
            'Software Engineering Principles', 'Cloud Computing Basics',
            'Data Science for Everyone', 'Cybersecurity Fundamentals',
            'Mobile App Development', 'React.js in Action', 'Angular Mastery',
            'iOS Development Guide', 'Android App Development', 'UI/UX Design Basics'
        ]

        authors = [
            'John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Brown', 'Chris Wilson'
        ]

        descriptions = [
            'A comprehensive guide to Python programming for beginners and experts alike.',
            'Learn the fundamentals of JavaScript and how to build interactive web applications.',
            'Explore various data structures and algorithms with practical examples.',
            'Master machine learning concepts and apply them using Python libraries.',
            'Build powerful web applications with Django and Python.',
            'An introduction to the basics of artificial intelligence and its applications.',
            'Learn about relational and NoSQL databases and their management.',
            'Discover the principles of network security and best practices.',
            'An in-depth guide to Java programming for beginners.',
            'Get started with C++ programming language with hands-on exercises.'
        ]

        try:
            successful_count = 0
            for _ in range(10000):
                title = random.choice(titles)
                author = random.choice(authors)
                description = random.choice(descriptions)
                Book.objects.create(title=title, author=author, description=description)
                successful_count += 1

            self.stdout.write(self.style.SUCCESS(f'Successfully populated the database with {successful_count} books'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to populate the database: {e}'))
