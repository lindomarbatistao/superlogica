from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('users', listar_usuarios, name="listar_usuarios"),

    # path('usuarios', UsuarioListCreateAPIView.as_view()),
    # path('usuario/<int:pk>', UsuarioDetailView.as_view()),

    # path('imoveis', ImovelListCreateAPIView.as_view()),
    # path('imovel/<int:pk>', ImovelDetailView.as_view()),
    
    # path('pagamentos', PagamentoListCreateAPIView.as_view()),
    # path('pagamento/<int:pk>', PagamentoDetailView.as_view()),
    
    # path('contratos', ContratoListCreateAPIView.as_view()),
    # path('contrato/<int:pk>', ContratoDetailView.as_view()),

]



