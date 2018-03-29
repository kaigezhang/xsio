from uuid import uuid4

from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.db import models

from scholar.apps.core.models import TimestampedModel


class Tag(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    tag = models.CharField(max_length=255)
    slug = models.SlugField(db_index=True, unique=True, null=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True)
    object_id = models.UUIDField(null=True)
    content_object = GenericForeignKey('content_type', 'object_id')

    def __str__(self):
        return self.tag


class Comment(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    body = models.TextField()
    author = models.ForeignKey('profiles.Profile', related_name='comments', on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    content_object = GenericForeignKey('content_type', 'object_id')

    def __str__(self):
        return self.body


class Post(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    headline = models.CharField(max_length=255)
    slug = models.SlugField(db_index=True, unique=True, null=True)
    body_text = models.TextField(null=True)
    author = models.ForeignKey('profiles.Profile', on_delete=models.CASCADE, related_name='posts')
    rating = models.IntegerField(default=0)
    tags = GenericRelation(Tag)
    comments = GenericRelation(Comment, related_query_name='posts')
    files = models.ManyToManyField('papers.File', related_name='posts')

    def __str__(self):
        return self.headline


    @property
    def comments_count(self):
        return self.comments.count()