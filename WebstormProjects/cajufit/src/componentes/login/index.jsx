import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginForm({ setAuthToken }) {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});
    const [nonFieldErrors, setNonFieldErrors] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();  // Hook para redirecionamento

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = 'O campo de usuário é obrigatório.';
        if (!formData.password) newErrors.password = 'O campo de senha é obrigatório.';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setNonFieldErrors('');
        setSuccessMessage('');

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setIsSubmitting(true);

            // Etapa 1: Registro do usuário
            const registerResponse = await axios.post(
                'http://127.0.0.1:8000/api/usuarios/',
                { ...formData },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (registerResponse.status === 201) {
                // Registro bem-sucedido, agora faça o login

                const loginResponse = await axios.post(
                    'http://127.0.0.1:8000/login/',
                    {
                        username: formData.username,
                        password: formData.password,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (loginResponse.data && loginResponse.data.token) {
                    const token = loginResponse.data.token;
                    setSuccessMessage('Login bem-sucedido!');
                    localStorage.setItem('authToken', token);
                    setAuthToken(token);
                    navigate('/'); // Redireciona para a home
                } else {
                    setNonFieldErrors('Token de autenticação não recebido. Verifique a API.');
                }
            } else {
                setNonFieldErrors('Falha no registro. Verifique os dados enviados.');
            }
        } catch (error) {
            if (error.response) {
                setErrors(error.response.data.errors || {});
                setNonFieldErrors(
                    error.response.data.non_field_errors || 'Erro desconhecido.'
                );
            } else {
                setNonFieldErrors(
                    navigate('/'),
                    window.location.reload(false),
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#F3E9D2' }}>
            <div className="container mx-auto px-4">
                <div className="flex justify-center">
                    <div className="w-full max-w-md pt-12 rounded-lg shadow-2xl" style={{ backgroundColor: '#FF8600', boxShadow: '0 11px 12px rgba(0, 0, 0, 1)' }}>
                        <div className="p-8" style={{ backgroundColor: '#fff' }}>
                            <div className="text-center mb-4">
                                <h1 className="text-2xl font-semibold">Conecte-se agora</h1>
                                <hr className="my-4" />
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="mb-4">
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                        Usuário
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.username ? 'border-red-500' : ''}`}
                                    />
                                    {errors.username && (
                                        <p className="text-red-500 text-sm mt-2">{errors.username}</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Senha
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.password ? 'border-red-500' : ''}`}
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-2">{errors.password}</p>
                                    )}
                                </div>

                                {nonFieldErrors && (
                                    <div className="alert alert-danger">
                                        <p className="text-red-500 text-sm">{nonFieldErrors}</p>
                                    </div>
                                )}

                                <div className="form-content">
                                    <button
                                        type="submit"
                                        className="w-full bg-[#333333] text-white font-semibold py-2 px-4 rounded hover:bg-[#96c049] transition duration-300 transform hover:scale-105"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Carregando...' : 'Conecte-se'}
                                    </button>
                                </div>
                                {successMessage && (
                                    <p className="text-green-500 text-sm mt-4">{successMessage}</p>
                                )}
                            </form>
                        </div>
                        <div className="flex items-center justify-center text-white h-16 shadow-2xl">
                            <p>© 2024 CajuFit</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default LoginForm;
