'use client'; // Necessário para usar hooks e interatividade

import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/auth-context'; // Ajuste o caminho se necessário

export default function MasterDashboardPage() {
  const { currentUser, logout, isMaster, isLoading } = useAuth();
  const router = useRouter();

  // Se ainda estiver carregando o estado de autenticação, pode mostrar um loader
  if (isLoading) {
    return <div className="p-8 text-white">Carregando...</div>;
  }

  // Se não estiver logado ou não for master, redireciona para o login
  // (Esta verificação também pode/deve ser feita por um layout protegido ou middleware no futuro)
  if (!currentUser || currentUser.user_type !== 'master') {
    // Idealmente, um AuthGuard ou um layout protegido faria isso de forma mais robusta.
    // router.push('/login'); // Comentei para não causar redirect imediato se o contexto demorar um pouco
    // return <div className="p-8 text-white">Redirecionando para login...</div>;
    // Por agora, vamos assumir que o usuário chegou aqui após um login de master bem-sucedido.
  }

  const handleLogout = () => {
    logout(); // Chama a função de logout do nosso AuthContext
  };

  return (
    <div className="p-8 text-white"> {/* Adicionado text-white para melhor visualização no fundo escuro */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard do Master</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          Sair (Logout)
        </button>
      </div>

      {currentUser && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <p className="text-lg">
            Bem-vindo, <span className="font-semibold">{currentUser.name}</span>!
          </p>
          <p className="text-sm text-gray-400">
            ID: {currentUser.id}
          </p>
          <p className="text-sm text-gray-400">
            Email: {currentUser.email}
          </p>
          <p className="text-sm text-gray-400">
            Tipo: {currentUser.user_type}
          </p>
        </div>
      )}
      
    </div>
  );
}