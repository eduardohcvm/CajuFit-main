import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'tailwindcss/tailwind.css';

const ProductCarousel = () => {
    const [products] = useState([
        {
            id: 1,
            image: '/images/unidade_americo.png',
            title: 'Unidade Jose Américo',
            description: 'Av. Hilton Souto Maior, 1058',
        }
    ]);

    const navigate = useNavigate();  // Hook do React Router para navegação

    const handleLearnMoreClick = () => {
        navigate('/register');  // Redireciona para a rota /formulario
    };

    const handleUnidadeMangabeiraClick = () => {
        navigate('/unidade_mangabeira');  // Redireciona para a rota /unidade_mangabeira
    };

    return (
        <main className="bg-[#F3E9D2] text--[#373435] min-h-screen">
            {/* Cabeçalho */}
            <section className="py-10 bg-gradient-to-r from-[#F3E9D2] to-[#F3E9D2] shadow-lg">
                <div className="container mx-auto flex items-center justify-between">
                    <button
                        className="mt-6 px-6 py-2 bg-[#a7c95e] text-[#373435] rounded-full hover:bg-[#96c049] transition ml-6 flex items-center gap-2"
                        onClick={handleUnidadeMangabeiraClick} // Chama a função para redirecionar
                    >
                        <img src={"/images/arrow_left.png"} className="w-5 h-5 inline-block" />
                        Unidade Mangabeira
                    </button>
                    <div className="flex flex-col items-center text-center mx-auto">
                        <h1 className="text-5xl font-extrabold text-[#333333] mb-4">
                            Unidade José Américo
                        </h1>
                        <p className="text-black-300 max-w-xl mx-auto">
                            Av. Hilton Souto Maior, 1058
                        </p>
                    </div>
                </div>
            </section>

            {/* Carrossel de Produtos */}
            <section className="container mx-auto px-4 py-8 max-w-4xl ">
                <Carousel
                    showThumbs={false}
                    showStatus={false}
                    infiniteLoop
                    autoPlay
                    interval={9000}
                    className="shadow-lg rounded-lg overflow-hidden"
                >
                    {products.map((product) => (
                        <div key={product.id} className="relative group">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="object-cover w-full h-[500px] max-h-[600px] transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                    ))}
                </Carousel>
            </section>

            {/* Seção de Mais Detalhes */}
            <section className="py-12 bg-gradient-to-r from-[#B4C79C] to-[#B4C79C] text-center text-white">
                <h2 className="text-4xl font-bold mb-6 text-[#333333]">Saiba Mais</h2>
                <p className="max-w-2xl mx-auto text-black">
                    Nossos ambientes são projetados para serem funcionais, confortáveis e modernos.
                    Clique no botão abaixo para fazer a sua matrícula agora mesmo.
                </p>
                <button
                    className="mt-6 px-6 py-2 bg-[#a7c95e] text-[#373435] rounded-full hover:bg-[#96c049] transition"
                    onClick={handleLearnMoreClick} // Chama a função para redirecionar
                >
                    Matricule-se
                </button>
            </section>
        </main>
    );
};

export default ProductCarousel;
