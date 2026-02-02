from rest_framework import serializers
from .models import Usuario, Imovel, Contrato, Pagamento

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class ImovelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Imovel
        fields = '__all__'

class ContratoSerilizer(serializers.ModelSerializer):
    class Meta:
        model = Contrato
        fields = '__all__'

class PagamentoSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Pagamento
        fields = '__all__'

