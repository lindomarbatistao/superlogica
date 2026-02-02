from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Usuario, Imovel, Contrato, Pagamento
from .serializers import (
    UsuarioSerializer, 
    ImovelSerializer, 
    ContratoSerilizer, 
    PagamentoSerializer
)
