import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
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

  if (isLoading) {
    return <p>Carregando informações...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
      <div className="min-h-screen bg-[#F3E9D2] flex items-center justify-center p-4">
        <div className="w-full max-w-4xl p-8 space-y-8 bg-white rounded-lg shadow-lg">
          <UserInfoSection userData={userData} />
        </div>
      </div>
  );
};

const UserInfoSection = ({ userData }) => (
    <section className="p-8 bg-[#F3E9D2] rounded-lg shadow flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-[#333333] text-center mb-4">
        Informações da Conta
      </h2>
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
    </section>
);

export default Profile;
