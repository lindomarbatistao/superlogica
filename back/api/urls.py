from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('usuarios', UsuarioListCreateAPIView.as_view()),
    path('usuario/<int:pk>', UsuarioUpdateDestroyView.as_view()),
    path('users', listar_usuarios),

    path('imoveis', ImovelListCreateAPIView.as_view()),
    path('imovel/<int:pk>', ImovelUpdateDestroyView.as_view()),
    
    path('pagamentos', PagamentoListCreateAPIView.as_view()),
    path('pagamento/<int:pk>', PagamentoUpdateDestroyView.as_view()),
    
    path('contratos', ContratoListCreateAPIView.as_view()),
    path('contrato/<int:pk>', ContratoUpdateDestroyView.as_view()),

]



