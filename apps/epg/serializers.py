from core.utils import validate_flexible_url
from rest_framework import serializers
from .models import EPGSource, EPGData, ProgramData
from apps.channels.models import Channel

class EPGSourceSerializer(serializers.ModelSerializer):
    epg_data_ids = serializers.SerializerMethodField()
    read_only_fields = ['created_at', 'updated_at']
    url = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        validators=[validate_flexible_url]
    )

    class Meta:
        model = EPGSource
        fields = [
            'id',
            'name',
            'source_type',
            'url',
            'api_key',
            'is_active',
            'file_path',
            'refresh_interval',
            'status',
            'last_message',
            'created_at',
            'updated_at',
            'epg_data_ids'
        ]

    def get_epg_data_ids(self, obj):
        return list(obj.epgs.values_list('id', flat=True))

class ProgramDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramData
        fields = ['id', 'start_time', 'end_time', 'title', 'sub_title', 'description', 'tvg_id']

class EPGDataSerializer(serializers.ModelSerializer):
    """
    Only returns the tvg_id and the 'name' field from EPGData.
    We assume 'name' is effectively the channel name.
    """
    read_only_fields = ['epg_source']

    class Meta:
        model = EPGData
        fields = [
            'id',
            'tvg_id',
            'name',
            'epg_source',
        ]
