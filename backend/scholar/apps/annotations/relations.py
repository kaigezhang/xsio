from rest_framework_json_api import relations
from scholar.apps.posts.models import Tag


class TagRelatedField(relations.ResourceRelatedField):

    def get_queryset(self):
        return Tag.objects.all()

    def to_internal_value(self, data):
        # print('data {}'.format(data['attributes']['tag']))
        tag = data['attributes']['tag']
        print('data {}'.format(data))
        tag, created = Tag.objects.get_or_create(
            tag=tag,
            slug=tag.lower(),
        )

        return tag

    # def to_representation(self, value):
    #     return value