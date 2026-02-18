from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Usuario, Imovel, Contrato, Pagamento
from rest_framework.decorators import api_view
from .serializers import *


############################## Via Método ###########################################
@api_view(['GET', 'POST'])
def listar_usuarios(request):
    if request.method=='GET':
        queryset = Usuario.objects.all()
        serializers = UsuarioSerializer(queryset, many=True)
        return Response(serializers.data)
    elif request.method=='POST':
        serializers=UsuarioSerializer(data = request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
        

############################## Via Generics ###########################################
# class UsuarioListCreateAPIView(ListCreateAPIView):
#     queryset = Usuario.objects.all()
#     serializer_class = UsuarioSerializer

# class UsuarioDetailView(RetrieveUpdateDestroyAPIView):
#     queryset = Usuario.objects.all()
#     serializer_class = UsuarioSerializer

class ImovelListCreateAPIView(ListCreateAPIView):
    queryset = Imovel.objects.all()
    serializer_class = ImovelSerializer

class ImovelDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Imovel.objects.all()
    serializer_class = ImovelSerializer

class PagamentoListCreateAPIView(ListCreateAPIView):
    queryset = Pagamento.objects.all()
    serializer_class = PagamentoSerializer

class PagamentoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Pagamento.objects.all()
    serializer_class = PagamentoSerializer

class ContratoListCreateAPIView(ListCreateAPIView):
    queryset = Contrato.objects.all()
    serializer_class = ContratoSerializer

class ContratoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Contrato.objects.all()
    serializer_class = ContratoSerializer



############################## Via APIView ###########################################
class UsuarioListCreateAPIView(APIView):

    def get(self, request):
        usuarios = Usuario.objects.all()
        serializer = UsuarioSerializer(usuarios, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
    
class UsuarioDetailView(APIView):

    def get_object(self, pk):
        return Usuario.objects.get(pk=pk)
    
    def get(self, pk):
        usuario =  self.get_object(pk)
        serializer = UsuarioSerializer(usuario)
        return Response(serializer.data)
    
    def delete(self, request, pk ):
        usuario = self.get_object(pk)
        usuario.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def put(self, request, pk):
        usuario = self.get_object(pk)
        serializer = UsuarioSerializer(usuario, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
