from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework_json_api.views import ModelViewSet

from scholar.apps.annotations.models import Annotation
from .models import Post, Comment, Tag
from .serializers import PostSerializer, CommentSerializer, TagSerializer


class PostViewSet(ModelViewSet):
    resource_name = 'posts'
    lookup_field = 'slug'
    queryset = Post.objects.select_related('author', 'author__user')
    serializer_class = PostSerializer

    def get_queryset(self, *args, **kwargs):
        queryset = self.queryset
        author = self.request.query_params.get('author', None)
        if author is not None:
            queryset = queryset.filter(author__user__username=author)
        tag = self.request.query_params.get('tag', None)
        if tag is not None:
            queryset = queryset.filter(tags__tag=tag)
        favorited_by = self.request.query_params.get('favorited', None)
        if favorited_by is not None:
            queryset = queryset.filter(
                favorited_by__user__username=favorited_by
            )
        return queryset

    def create(self):
        context = {
            'author': self.request.user.profile,
        }

        data = self.request.data
        serializer = self.serializer_class(data=data, context=context)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    prefetch_for_includes = {
        '__all__': [],
        'author': ['author__profile', 'author__posts']
    }

    def get_queryset(self):
        queryset = Comment.objects.all()
        if 'annotation_pk' in self.kwargs:
            annotation_pk = self.kwargs['annotation_pk']
            queryset = queryset.filter(annotations__pk=annotation_pk)
        if 'post_slug' in self.kwargs:
            post_slug = self.kwargs['post_slug']
            queryset = queryset.filter(posts__slug=post_slug)
        return queryset

    def create(self, request, annotation_pk=None, post_slug=None):
        data = request.data
        context = {'author': request.user.profile}
        if annotation_pk is not None:
            try:
                context['content_object'] = Annotation.objects.get(pk=annotation_pk)
            except Annotation.DoesNotExist:
                raise NotFound('Annotation not found')
        if post_slug is not None:
            try:
                context['content_object'] = Post.objects.get(slug=post_slug)
            except Post.DoesNotExist:
                raise NotFound('Post does not exists')

        serializer = self.serializer_class(data=data, context=context)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TagViewSet(ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


# class PostRelationshipView(ModelViewSet):
#     queryset = Post.objects.all()