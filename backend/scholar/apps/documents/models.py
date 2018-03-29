from uuid import uuid4

from django.db import models

from scholar.apps.core.models import TimestampedModel


class Collection(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    # urlId = models.CharField(max_length=255) # 为了方便进行访问
    name = models.CharField(max_length=125)
    description = models.TextField()
    color = models.CharField(max_length=10)
    # type = models.CharField() # 可以有不同类型，比如笔记，文章，杂志，地图集等

    creator = models.ForeignKey('profiles.Profile', related_name='collections')

    def __str__(self):
        return self.name


class Document(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    # urlId = models.CharField(max_length=10, primary_key=True)
    slug = models.SlugField(db_index=True, unique=True, null=True)
    private = models.BooleanField(default=True)
    title = models.CharField(max_length=255)
    text = models.TextField(null=True)
    emoji = models.CharField(max_length=255, null=True)
    parent = models.ForeignKey('self', related_name='children', null=True)
    # created_by = models.ForeignKey('profiles.Profile', related_name='Document')
    created_by = models.ForeignKey('profiles.Profile', related_name='created')
    updated_by = models.ForeignKey('profiles.Profile', related_name='updated')
    published_at = models.DateTimeField(null=True)

    stars = models.ManyToManyField('profiles.Profile', related_name='starred')
    views = models.ManyToManyField('profiles.Profile', related_name='viewed')

    collaborators = models.ManyToManyField('profiles.Profile', related_name='documents') # 只有是协作者才能对文章进行编辑修改，并且修改记录到版本系统，目前还没有采用git版本管理

    collection = models.ForeignKey(Collection, related_name='documents')

    def __str__(self):
        return self.title

    # @property
    # def stars_count(self):
    #     return self.stars.count()
    #
    # @property
    # def views_count(self):
    #     return self.views.count()

    # def revision_count(self):
    #     return self.revisions.count()


# 后期可能添加的版本控制系统，利用django的信号系统
# class Revision(TimestampedModel):
#     id = models.UUIDField(primary_key=True, default=uuid4)
#     title = models.CharField(max_length=255)
#     text = models.TextField()
#
#     user = models.ForeignKey('profiles.Profile', related_name='revisions')
#     document = models.ForeignKey(Document, related_name='revisions')
#
