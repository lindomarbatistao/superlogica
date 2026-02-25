import django_filters
from .models import *

class UsuarioFilter(django_filters.FilterSet):
    nome = django_filters.CharFilter(field_name='nome', lookup_expr='icontains')
    tipo = django_filters.CharFilter(field_name='tipo', lookup_expr='iexact')

    class Meta:
        model = Usuario
        fields = ['nome', 'tipo']

class ImovelFilter(django_filters.FilterSet):
    tipo = django_filters.CharFilter(field_name='tipo', lookup_expr='icontains')
    status = django_filters.CharFilter(field_name='status', lookup_expr='iexact')

    class Meta:
        model = Imovel
        fields = ['tipo', 'status']

class ContratoFilter(django_filters.FilterSet):
    data_inicio = django_filters.DateFilter(field_name='data_inicio',lookup_expr='gte')
    data_fim = django_filters.DateFilter(field_name='data_fim',lookup_expr='lte')
    valor_min = django_filters.NumberFilter(field_name='valor', lookup_expr='gte')
    valor_max = django_filters.NumberFilter(field_name='valor', lookup_expr='lte')

    class Meta:
        model = Contrato
        fields = ['data_inicio', 'data_fim', 'valor']

class PagamentoFilter(django_filters.FilterSet):
    pass