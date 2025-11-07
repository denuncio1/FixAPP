import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import AppLogo from "@/components/AppLogo"; // Importar AppLogo

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <AppLogo className="mx-auto mb-8" /> {/* Adicionar o logo aqui */}
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Página não encontrada</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Retornar à Página Inicial
        </a>
      </div>
    </div>
  );
};

export default NotFound;