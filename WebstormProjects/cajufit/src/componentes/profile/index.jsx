import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/user-info/", {
          headers: { Authorization: `Token ${token}` },
        });

        setUserData(response.data);
      } catch (error) {
        setError("Erro ao carregar informações do usuário.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        "http://127.0.0.1:8000/api/user-info/",
        userData,
        { headers: { Authorization: `Token ${token}` } }
      );

      setSuccessMessage(response.data.message || "Dados atualizados com sucesso!");
      setIsEditing(false);
    } catch (error) {
      setError("Erro ao atualizar os dados.");
    }
  };

  if (isLoading) {
    return <p>Carregando informações...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen bg-[#F3E9D2] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-[#333333] text-center mb-4">
          Informações da Conta
        </h2>

        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!isEditing ? (
          <UserInfoSection userData={userData} onEdit={() => setIsEditing(true)} />
        ) : (
          <EditUserForm
            userData={userData}
            onInputChange={handleInputChange}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        )}
      </div>
    </div>
  );
};

const UserInfoSection = ({ userData, onEdit }) => (
  <section className="p-8 bg-[#F3E9D2] rounded-lg shadow flex flex-col items-center">
    <div className="space-y-2 text-left">
      <p>
        <strong>Nome Completo:</strong> {userData.first_name || "N/A"} {userData.last_name || ""}
      </p>
      <p>
        <strong>Usuário:</strong> {userData.username || "N/A"}
      </p>
      <p>
        <strong>Email:</strong> {userData.email || "N/A"}
      </p>
    </div>
    <button
      className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={onEdit}
    >
      Alterar Dados
    </button>
  </section>
);

const EditUserForm = ({ userData, onInputChange, onSave, onCancel }) => (
  <section className="p-8 bg-[#F3E9D2] rounded-lg shadow flex flex-col">
    <div className="space-y-4">
      <div>
        <label className="block font-bold text-gray-700">Nome:</label>
        <input
          type="text"
          name="first_name"
          value={userData.first_name || ""}
          onChange={onInputChange}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block font-bold text-gray-700">Sobrenome:</label>
        <input
          type="text"
          name="last_name"
          value={userData.last_name || ""}
          onChange={onInputChange}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block font-bold text-gray-700">Email:</label>
        <input
          type="email"
          name="email"
          value={userData.email || ""}
          onChange={onInputChange}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>
    </div>
    <div className="mt-4 flex justify-end space-x-4">
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={onSave}
      >
        Salvar
      </button>
      <button
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        onClick={onCancel}
      >
        Cancelar
      </button>
    </div>
  </section>
);

export default Profile;
