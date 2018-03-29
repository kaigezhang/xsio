from rest_framework_json_api import serializers, relations
from scholar.apps.profiles.serializers import ProfileSerializer
from .models import Tag, Comment, Post


# from .


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('tag',)


class CommentSerializer(serializers.ModelSerializer):

    author = ProfileSerializer(read_only=True)
    # included_serializers = {
    #     'author': 'scholar.apps.profiles.serializers.ProfileSerializer'
    # }
    createdAt = serializers.SerializerMethodField(method_name='get_created_at')
    updatedAt = serializers.SerializerMethodField(method_name='get_updated_at')

    class Meta:
        model = Comment
        fields = (
            'id',
            'author',
            'body',
            'createdAt',
            'updatedAt',
        )

    def get_created_at(self, instance):
        return instance.created_at.isoformat()

    def get_updated_at(self, instance):
        return instance.updated_at.isoformat()

    def create(self, validated_data):
        content_object = self.context['content_object']
        author = self.context['author']

        return Comment.objects.create(
            author=author,
            content_object=content_object,
            **validated_data
        )


class PostSerializer(serializers.ModelSerializer):

    def __init__(self, *args, **kwargs):
        super(PostSerializer, self).__init__(*args, **kwargs)
        request = kwargs.get('context', {}).get('request')
        if request and 'featured' not in request.query_params.get('include', []):
            self.fields.pop('featured', None)

    include_serializers = {
        'comments': 'scholar.apps.posts.serializers.CommentSerializer',
        'featured': 'scholar.apps.posts.serializers.PostSerializer',
        'suggested': 'scholar.apps.posts.serializers.PostSerializer',
        'tags': 'scholar.apps.posts.serializers.TagSerializer',
    }
    author = ProfileSerializer(read_only=True)
    body_text = serializers.CharField(required=False)

    favorited = serializers.SerializerMethodField()
    favoritesCount = serializers.SerializerMethodField(
        method_name='get_favorites_count'
    )

    tags = TagSerializer(
        many=True, read_only=True
    )
    comments = CommentSerializer(
        many=True, read_only=True
    )

    suggested = relations.SerializerMethodResourceRelatedField(
        source='get_suggested',
        model=Post,
        many=True,
        read_only=True,
        related_link_view_name='post-suggested',
        related_link_url_kwarg='post_pk',
        # self_link_view_name='post-relationships',
    )

    featured = relations.SerializerMethodResourceRelatedField(
        source='get_featured',
        model=Post,
        read_only=True
    )

    def get_suggested(self, obj):
        return Post.objects.exclude(pk=obj.pk)

    def get_featured(self, obj):
        return Post.objects.exclude(pk=obj.pk).first()

    def get_favorites_count(self, obj):
        pass

    class Meta:
        model = Post
        fields = (
            'body_text',
            'author',
            'comments',
            'tags',
            'featured',
            'suggested',
            'favorited',
            'favoritesCount',
        )
        read_only_fields = ('tags',)

    # class JSONAPIMeta:
    #     included_resources = ['comments', 'tags']

    def create(self, validated_data):
        author = self.context.get('author', None)
        tags = validated_data.pop('tags', [])
        post = Post.objects.create(author=author, **validated_data)

        for tag in tags:
            post.tags.add(tag)

        return post

