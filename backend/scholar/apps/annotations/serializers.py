# from rest_framework_json_api.serializers import ModelSerializer, JSONField
from rest_framework_json_api import serializers, relations

from scholar.apps.posts.models import Tag
from .models import Annotation, Channel
from scholar.apps.papers.models import File
from scholar.apps.profiles.serializers import ProfileSerializer
from scholar.apps.profiles.models import Profile
from rest_framework.exceptions import NotFound
from .relations import TagRelatedField


class ChannelSerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    description = serializers.CharField()
    owner = relations.ResourceRelatedField(queryset=Profile.objects.all())
    members = ProfileSerializer(many=True)

    createdAt = serializers.SerializerMethodField(method_name='get_created_at')
    updatedAt = serializers.SerializerMethodField(method_name='get_updated_at')

    include_serializers = {
        'owner': 'scholar.apps.profiles.serializers.ProfileSerializer',
        'memebers': 'scholar.apps.profiles.serializers.ProfileSerializer',
    }

    class Meta:
        model = Channel
        fields = ('id', 'name', 'description', 'owner', 'members')

    def get_created_at(self, instance):
        return instance.created_at.isoformat()

    def get_updated_at(self, instance):
        return instance.updated_at.isoformat()


class AnnotationSerializer(serializers.ModelSerializer):

    file = relations.ResourceRelatedField(read_only=True)
    author = relations.ResourceRelatedField(read_only=True)
    selectors = serializers.JSONField()

    favorited = serializers.SerializerMethodField()
    favoritesCount = serializers.SerializerMethodField(
        method_name='get_favorites_count')

    # tagList = relations.ResourceRelatedField(many=True, read_only=True)
    # tags = relations.ResourceRelatedField(many=True, queryset=Tag.objects.all(), allow_null=True)

    # 自定义方法来处理关系
    tags = TagRelatedField(many=True, required=False)

    comments = relations.ResourceRelatedField(
        many=True,
        read_only=True,
        related_link_view_name='annotation-comments',
        related_link_url_kwarg='annotation_pk',
        # TODO 暂时未发现实用性
        # self_link_view_name='annotation-relationships'
    )

    createdAt = serializers.SerializerMethodField(method_name='get_created_at')
    updatedAt = serializers.SerializerMethodField(method_name='get_updated_at')

    included_serializers = {
        'file': 'scholar.apps.papers.serializers.FileSerializer',
        'author': 'scholar.apps.profiles.serializers.ProfileSerializer',
        'tags': 'scholar.apps.posts.serializers.TagSerializer',
        'comments': 'scholar.apps.posts.serializers.CommentSerializer',
    }

    @staticmethod
    def setup_eager_loading(queryset):
        queryset = queryset.select_related('author')
        return queryset

    def get_created_at(self, instance):
        return instance.created_at.isoformat()

    def get_updated_at(self, instance):
        return instance.updated_at.isoformat()

    def get_favorited(self, instance):
        request = self.context.get('request', None)

        if request is None:
            return False

        if not request.user.is_authenticated():
            return None

        return request.user.profile.is_favoriting(instance)

    def get_favorites_count(self, instance):
        return instance.favorited_by.count()

    def create(self, validated_data):
        profile = self.context['request'].user.profile
        file_pk = self.context['file_pk']
        if file_pk:
            try:
                file = File.objects.get(pk=file_pk)
            except File.DoesNotExist:
                raise NotFound('File Not Found')
        tags = validated_data.pop('tags', [])
        annotation = Annotation.objects.create(
            **validated_data,
            author=profile,
            file=file,
        )

        for tag in tags:
            annotation.tags.add(tag)

        return annotation
    class JSONAPIMeta:
        included_resources = ['author']
    class Meta:
        model = Annotation
        fields = (
            'id',
            'public',
            'file',
            'selectors',
            'comment',
            'color',
            'author',
            'tags',
            'favorited',
            'favoritesCount',
            'comments',
            'createdAt',
            'updatedAt',
        )
