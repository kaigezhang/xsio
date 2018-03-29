from rest_framework_json_api import serializers

from scholar.apps.profiles.serializers import ProfileSerializer
from .models import Collection, Document
from rest_framework.exceptions import NotFound


class CollectionSerializer(serializers.ModelSerializer):
    creator = ProfileSerializer(read_only=True)
    documents = serializers.ResourceRelatedField(many=True, read_only=True)

    included_serializers = {
        'documents': 'scholar.apps.documents.serializers.DocumentSerializer'
    }

    class Meta:
        model = Collection
        fields = (
            'id',
            'name',
            'description',
            'color',
            'creator',
            'documents',
        )

    def create(self, validated_data):
        creator = self.context.get('creator', None)
        post = Collection.objects.create(creator=creator, **validated_data)

        return post

    class JSONAPIMeta:
        included_resources = ['documents']

class DocumentSerializer(serializers.ModelSerializer):
    createdAt = serializers.SerializerMethodField(method_name='get_created_at')
    updatedAt = serializers.SerializerMethodField(method_name='get_updated_at')
    publishedAt = serializers.SerializerMethodField(method_name='get_published_at')

    created_by = ProfileSerializer(read_only=True)
    updated_by = ProfileSerializer(read_only=True)

    parent = serializers.ResourceRelatedField(read_only=True)
    stars = ProfileSerializer(many=True, read_only=True)
    views = ProfileSerializer(many=True, read_only=True)

    collection = serializers.ResourceRelatedField(read_only=True)

    included_serializers = {
        'parent': 'scholar.apps.documents.serializers.DocumentSerializer',
        'collection': 'scholar.apps.documents.serializers.CollectionSerializer',
    }

    

    class Meta:
        model = Document
        fields = (
            'id',
            'slug',
            'private',
            'title',
            'text',
            'parent',
            'stars',
            'views',
            'createdAt',
            'updatedAt',
            'publishedAt',
            'collection',

            'created_by',
            'updated_by',
        )

    class JSONAPIMeta:
        resource_name = 'documents'
        included_resources = ['collection']

    def create(self, validated_data):
        profile = self.context['request'].user.profile
        collection_pk = self.context['collection_pk']
        parent_id = validated_data.pop('parent', None)
        parent = None
        if parent_id is not None:
            try:
                parent = Document.objects.get(pk=parent_id)
            except Document.DoesNotExist:
                raise NotFound('Parent document not found')
        if collection_pk is not None:
            try:
                collection = Collection.objects.get(pk=collection_pk)
            except Collection.DoesNotExist:
                raise NotFound('Collection Not Found')

            document = Document.objects.create(
                **validated_data,
                parent=parent,
                created_by=profile,
                updated_by=profile,
                collection=collection,
            )
            return document

    def get_created_at(self, instance):
        return instance.created_at.isoformat()

    def get_updated_at(self, instance):
        return instance.updated_at.isoformat()

    def get_published_at(self, instance):
        published_at = instance.published_at
        if published_at is not None:
            return published_at.isoformat()
