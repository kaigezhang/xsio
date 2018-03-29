from django.db import models
from scholar.apps.core.models import TimestampedModel
from jsonfield import JSONField
from uuid import uuid4
from django.contrib.contenttypes.fields import GenericRelation


class Channel(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    name = models.CharField(max_length=128)
    description = models.TextField()
    owner = models.ForeignKey('profiles.Profile', related_name='channles', on_delete=models.CASCADE)
    members = models.ManyToManyField('profiles.Profile', related_name='joined_by')

    def __str__(self):
        return self.name

    def join(self, profile):
        return self.members.add(profile)

    def unjoin(self, profile):
        return self.members.remove(profile)

    def is_joining(self, profile):
        return self.members.filter(pk=profile.pk).exists()

    def has_joined(self, profile):
        return self.joined_by.filter(pk=profile.pk).exists()

    def add_annotation(self, annotation):
        self.annotations.add(annotation)


class Annotation(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    author = models.ForeignKey('profiles.Profile', related_name='annotations', null=True)
    file = models.ForeignKey('papers.File', related_name='annotations', blank=True, null=True)
    selectors = JSONField(null=True)
    comment = models.TextField(null=True)
    color = models.IntegerField(null=True, default=0)
    channel = models.ForeignKey(Channel, null=True, on_delete=models.SET_NULL)

    public = models.BooleanField(default=True)
    tags = GenericRelation('posts.Tag', related_query_name='annotations')
    comments = GenericRelation('posts.Comment', related_query_name='annotations')

    def __str__(self):
        return self.comment

    class Meta:
        ordering = None

    def add_to_channel(self, channel):
        self.channel = channel