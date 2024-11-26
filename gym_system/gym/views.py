from rest_framework import viewsets
from django.shortcuts import render
from .models import Aluno, Exercicio, Treino, TreinoExercicio, Progresso
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from .serializers import (
    AlunoSerializer,
    ExercicioSerializer,
    TreinoSerializer,
    TreinoExercicioSerializer,
    ProgressoSerializer,
)


class UsuarioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # O usuário autenticado
        return Response({
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        })


class AlunoViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer


class ExercicioViewSet(viewsets.ModelViewSet):
    queryset = Exercicio.objects.all()
    serializer_class = ExercicioSerializer


class TreinoViewSet(viewsets.ModelViewSet):
    queryset = Treino.objects.all()
    serializer_class = TreinoSerializer


class TreinoExercicioViewSet(viewsets.ModelViewSet):
    queryset = TreinoExercicio.objects.all()
    serializer_class = TreinoExercicioSerializer


class ProgressoViewSet(viewsets.ModelViewSet):
    queryset = Progresso.objects.all()
    serializer_class = ProgressoSerializer


def lista_alunos(request):
    alunos = Aluno.objects.all()
    return render(request, 'lista_alunos.html', {'alunos': alunos})


def detalhes_aluno(request, aluno_id):
    aluno = Aluno.objects.get(id=aluno_id)
    return render(request, 'detalhes_aluno.html', {'aluno': aluno})


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'Usuário registrado com sucesso!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username
        })
