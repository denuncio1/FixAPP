import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/components/SessionContextProvider"; // Importar o hook de sessão
import AppLogo from "@/components/AppLogo"; // Importar AppLogo

const Index = () => {
  const navigate = useNavigate();
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading) {
      if (session) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    }
  }, [session, isLoading, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <AppLogo className="mx-auto mb-8" /> {/* Adicionar o logo aqui */}
        <h1 className="text-4xl font-bold mb-4">Carregando...</h1>
        <p className="text-xl text-gray-600">
          Verificando sessão de usuário.
        </p>
      </div>
    </div>
  );
};

export default Index;