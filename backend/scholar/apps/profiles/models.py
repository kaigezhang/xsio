from django.db import models
from scholar.apps.core.models import TimestampedModel
from uuid import uuid4

class Profile(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    user = models.OneToOneField('authentication.User', on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    image = models.URLField(blank=True)

    follows = models.ManyToManyField(
        'self', related_name='followed_by', symmetrical=False,
    )

    collects = models.ManyToManyField(
        'posts.Post', related_name='collected_by'
    )

    favorites = models.ManyToManyField(
        'annotations.Annotation', related_name='favorited_by'
    )

    owns = models.ManyToManyField(
        'papers.File', related_name='owned_by'
    )

    def __str__(self):
        return self.user.username

    def follow(self, profile):
        return self.follows.add(profile)

    def unfollow(self, profile):
        return self.follows.remove(profile)

    def is_following(self, profile):
        return self.follows.filter(pk=profile.pk).exists()

    def is_followed_by(self, profile):
        return self.followed_by.filter(pk=profile.pk).exists()

    def is_collecting(self, post):
        return self.collects.filter(pk=post.pk).exists()

    def is_collected_by(self, post):
        return self.collected_by.filter(pk=post.pk).exists()

    def is_favoriting(self, annotation):
        return self.favorites.filter(pk=annotation.pk).exists()

    def is_favorited_by(self, annotation):
        return self.favorited_by.filter(pk=annotation.pk).exists()
        
    def own(self, file):
        return self.owns.add(file)
    
    def is_owning(self, file):
        return self.owns.filter(pk=file.pk).exists()

    def is_owned_by(self, file):
        return self.owned_by.filter(pk=file.pk).exists()
