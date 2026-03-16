from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Usuario, Imovel, Contrato, Pagamento
from rest_framework.decorators import api_view, action, permission_classes
from .serializers import *
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from .filters import *
from django_filters.rest_framework import DjangoFilterBackend

class UsuarioViewSet(ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend]
    filterset_class = UsuarioFilter

    def get_queryset(self):
        qs = super().get_queryset()

        if self.request.user.is_staff:
            return qs
        
        return qs.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == "me":
            return UsuarioMeSerializer
        return super().get_serializer_class()
    
    @action(
        detail=False,
        methods=['get'],
        url_path="me",
        permission_classes=[IsAuthenticated]
    )
    def me(self, request):
        usuario = Usuario.objects.filter(user=request.user).first()
        print("usuario: ", usuario)
        if not usuario:
            return Response({"detail":"Perfil de usuário não encontrado."}, status=404)
        
        serializer = self.get_serializer(usuario)
        return Response(serializer.data)
    
    @action(
        detail=False,
        methods=['get'],
        url_path="tipo-choices",
        permission_classes=[AllowAny]
    )
    def tipo_choices(self, request):
        return Response([
            {"value": v, "label": l}
            for v, l in Usuario.TIPO_CHOICES
        ])
    

class RegisterViewSet(APIView):
    permission_classes=[AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({"detail": "Usuário criado com sucesso."}, status=status.HTTP_201_CREATED)
        return Response({"detail": "Erro ao criar o usuário."}, status=status.HTTP_400_BAD_REQUEST)

class ImovelViewSet(ModelViewSet):
    queryset = Imovel.objects.all()
    serializer_class = ImovelSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_class = ImovelFilter

class ContratoViewSet(ModelViewSet):
    queryset = Contrato.objects.all()
    serializer_class = ContratoSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_class = ContratoFilter

class PagamentoViewSet(ModelViewSet):
    queryset = Pagamento.objects.all()
    serializer_class = PagamentoSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_class = PagamentoFilter


class MeView(RetrieveAPIView):
    serializer_class = UsuarioMeSerializer

    def get_object(self):
        perfil, created = Usuario.objects.get_or_create(
            user=self.request.user, 
            defaults={
                "nome": self.request.user.username,
                "email": self.request.user.email,
                "tipo": "LOCATARIO",
            }
        )
        return perfil

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail":"Usuário criado com sucesso."}, status=status.HTTP_201_CREATED)
        return Response({"detail":"Erro ao criar usuário."}, status=status.HTTP_400_BAD_REQUEST)