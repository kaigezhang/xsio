from rest_framework_json_api import serializers, relations
# from rest_framework_json_api.relations import ResourceRelatedField
from .models import (
    Author, Journal, Paper, File, Library
)
from scholar.apps.annotations.serializers import AnnotationSerializer
from scholar.apps.annotations.models import Annotation
from scholar.apps.profiles.serializers import ProfileSerializer


class LibrarySerializer(serializers.ModelSerializer):
    creator = ProfileSerializer(read_only=True)
    files = serializers.ResourceRelatedField(many=True, read_only=True)

    included_serializers = {
        'files': 'scholar.apps.papers.serializers.FileSerializer'
    }

    class Meta:
        model = Library
        fields = (
            'id',
            'name',
            'description',
            'color',
            'creator',
            'files',
        )

    def create(self, validated_data):
        creator = self.context.get('creator', None)
        library = Library.objects.create(creator=creator, **validated_data)

        return library
    
    class JSONAPIMeta:
        included_resources = ['files']


class JournalSerializer(serializers.ModelSerializer):
  class Meta:
    model = Journal
    fields = ['name', ]


class AuthorSerializer(serializers.ModelSerializer):
  class Meta:
    model = Author
    fields = ['initials',
              'forename',
              'lastname', ]


class PaperSerializer(serializers.ModelSerializer):
  journal = JournalSerializer(read_only=True)
  authors = AuthorSerializer(many=True, read_only=True)


  class Meta:
    model = Paper

    fields = [
        'journal',
        'authors',
        'title',
        'abstract',
        'year',
        'month',
        'volume',
        'pages',
        'page_from',
        'page_to',
    ]


class FileSerializer(serializers.HyperlinkedModelSerializer):
    # uuid = serializers.UUIDField()
    title = serializers.CharField(source='paper.title', read_only=True)
    paper = relations.ResourceRelatedField(read_only=True)
    authors = AuthorSerializer(
        many=True, read_only=True, source='paper.authors'
    )
    createdAt = serializers.SerializerMethodField(method_name='get_created_at')
    updatedAt = serializers.SerializerMethodField(method_name='get_updated_at')
    # annotations = relations.ResourceRelatedField(many=True, read_only=True)
    annotations = relations.ResourceRelatedField(
        many=True,
        read_only=True,
        related_link_view_name='file-annotations',
        related_link_url_kwarg='file_pk',
        # self_link_view_name='file-relationships'
    )

    libraries = relations.ResourceRelatedField(many=True, read_only=True)
    included_serializers = {
        'annotations': 'scholar.apps.annotations.serializers.AnnotationSerializer',
        'libraries': 'scholar.apps.papers.serializers.LibrarySerializer',
        'paper': 'scholar.apps.papers.serializers.PaperSerializer',
    }

    def get_created_at(self, instance):
        return instance.created_at.isoformat()

    def get_updated_at(self, instance):
        return instance.updated_at.isoformat()

    # def create(self, validated_data):
    #     paper = Paper.objects.get(pk=1)
    #     file = File.objects.create(paper=paper, **validated_data)
    #     return file

    class Meta:
        model = File
        fields = (
            'id',
            'title',
            'name',
            'hash',
            'paper',
            'authors',
            'createdAt',
            'updatedAt',
            'annotations',
            'libraries'
        )
        read_only_fields = (
            'annotations',
        )

    class JSONAPIMeta:
        resource_name = 'files'
        included_resources = ['paper']



