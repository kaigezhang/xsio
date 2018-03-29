from rest_framework_json_api import serializers, relations
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    bio = serializers.CharField(allow_blank=True, required=False)
    image = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()

    # followings = relations.ResourceRelatedField(many=True, read_only=True)
    # followers = relations.ResourceRelatedField(many=True, read_only=True)
    collects = relations.ResourceRelatedField(many=True, read_only=True)
    favorites = relations.ResourceRelatedField(many=True, read_only=True)
    owns = relations.ResourceRelatedField(many=True, read_only=True)

    followings = relations.SerializerMethodResourceRelatedField(
        source='get_followings', read_only=True, model=Profile,
    )
    followers = relations.SerializerMethodResourceRelatedField(
        source='get_followers', read_only=True, model=Profile,
    )

    related_serializers = {
        'followings': 'scholar.apps.profiles.serializers.ProfileSerializer',
        'followers': 'scholar.apps.profiles.serializers.ProfileSerializer',
        'collects': 'scholar.apps.posts.serializers.PostSerializer',
        'favorites': 'scholar.apps.annotations.serializers.annotationSerializer',
        'owns': 'scholar.apps.papers.serializers.FileSerializer',
    }


    class Meta:
        model = Profile
        fields = (
            'user',
            'username',
            'bio',
            'image',
            'following',
            'followers',
            'followings',
            'collects',
            'favorites',
            'owns',
        )
        read_only_fields = (
            'user',
            'username',
            'collects',
            'favorites',
            'owns',
            'followers',
            'followings',
        )

    def get_image(self, obj):
        if obj.image:
            return obj.image
        return 'https://static.productionready.io/images/smiley-cyrus.jpg'

    def get_following(self, instance):
        request = self.context.get('request', None)
        if request is None:
            return False
        if not request.user.is_authenticated():
            return False

        follower = request.user.profile
        followee = instance
        return follower.is_following(followee)

    def get_followings(self, instance):
        return instance.follows.all()

    def get_followers(self, instance):
        return instance.followed_by.all()

