from django.db import models
from django.conf import settings
from scholar.apps.core.models import TimestampedModel
from uuid import uuid4

UPLOAD_DIR = getattr(settings, 'UPLOAD_DIR', 'uploads')


class Author(models.Model):
    initials = models.CharField(max_length=10, null=True)
    forename = models.CharField(max_length=125, null=True)
    lastname = models.CharField(max_length=125, null=True)

    def __str__(self):
        return self.fullname

    @property
    def fullname(self):
        return self.forename + ' ' + self.lastname


class Journal(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Paper(models.Model):
    ''' Paper specific field '''
    id = models.UUIDField(primary_key=True, default=uuid4)
    journal = models.ForeignKey(
        Journal, on_delete=models.CASCADE, related_name='papers', null=True)
    authors = models.ManyToManyField(Author, related_name='papers')
    title = models.CharField(max_length=1000, null=True)
    abstract = models.TextField(null=True)
    year = models.PositiveIntegerField(null=True)
    month = models.PositiveIntegerField(null=True)
    volume = models.CharField(max_length=10, null=True)
    pages = models.CharField(max_length=20, null=True)
    page_from = models.CharField(max_length=10, null=True)
    page_to = models.CharField(max_length=10, null=True)

    def __str__(self):
        return self.title


class File(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    name = models.CharField(max_length=255)
    hash = models.CharField(max_length=128)
    paper = models.ForeignKey(Paper, related_name='files', null=True)

    def __str__(self):
        return self.name

    def add_to_paper(self, paper):
        self.paper = paper


class Library(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True)
    color = models.CharField(max_length=10, null=True)
    creator = models.ForeignKey(
        'profiles.Profile', on_delete=models.CASCADE, related_name='libraries')
    files = models.ManyToManyField(File, related_name='libraries')

    def __str__(self):
        return self.name

    def add(self, file):
        return self.files.add(file)

    def has_file(self, file):
        return self.files.filter(pk=file.pk).exists()
