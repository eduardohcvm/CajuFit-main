import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MeusTreinos = () => {
  const [treinos, setTreinos] = useState([]);
  const [concluidos, setConcluidos] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchTreinos = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/treinoexercicios/", {
          headers: { Authorization: `Token ${token}` },
        });
        setTreinos(response.data);
        const initialConcluidos = response.data.reduce((acc, treino) => {
          acc[treino.id] = treino.concluido;  // Inicializa o estado 'concluido' com os valores corretos
          return acc;
        }, {});
        setConcluidos(initialConcluidos);
      } catch (error) {
        console.error("Erro completo:", error);
        setError(error.response ? error.response.data : "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTreinos();
  }, [token, navigate]);

  const handleToggle = (id) => {
    setConcluidos((prevConcluidos) => ({
      ...prevConcluidos,
      [id]: !prevConcluidos[id],
    }));
  };

  if (isLoading) {
    return <p>Carregando treinos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen bg-[#F3E9D2] flex items-center justify-center p-4">
      <div className="w-full max-w-7xl p-8 space-y-8 bg-[#F3E9D2] rounded-lg shadow-[0px_10px_30px_rgba(0,0,0,0.3)]">
        <h1 className="text-2xl font-semibold text-[#333333] text-center mb-4">Treino Superior</h1>
        {/* Grid responsiva para os cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {treinos.map((treinoexercicio) => (
            <div
              key={treinoexercicio.id}
              className="bg-white shadow-lg rounded-lg p-4 hover:scale-105 transition"
            >
              {/* Exibe o nome do aluno associado ao treino */}
              <h2 className="text-lg font-bold text-gray-800">
                {treinoexercicio.treino.aluno.nome}
              </h2>
              {/* Exibe o nome do exercício associado */}
              <p className="text-2xl">
                <strong>{treinoexercicio.exercicio.nome}</strong>
              </p>
              <p>
                <strong>Carga:</strong> {treinoexercicio.carga}kg
              </p>
              <p>
                <strong>Séries:</strong> {treinoexercicio.series}
              </p>
              <p>
                <strong>Repetições:</strong> {treinoexercicio.repeticoes}
              </p>
              <button
                onClick={() => handleToggle(treinoexercicio.id)}
                className={`font-bold py-2 px-4 rounded transition duration-300 ease-in-out hover:scale-105 ${
                  concluidos[treinoexercicio.id]
                    ? "bg-green-500 text-white"
                    : "bg-[#E63946] text-black"
                }`}
              >
                {concluidos[treinoexercicio.id] ? "Concluído" : "Não Concluído"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default MeusTreinos;
