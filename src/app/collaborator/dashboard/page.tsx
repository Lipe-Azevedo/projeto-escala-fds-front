'use client'; // Necessário para usar hooks e interatividade

import { useRouter } from 'next/navigation'; // Embora não usado diretamente aqui, pode ser útil
import { useAuth } from '../../../contexts/auth-context'; // Ajuste o caminho se o seu alias @/ estiver funcionando: '@/contexts/auth-context'

export default function CollaboratorDashboardPage() {
  const { currentUser, logout, isLoading } = useAuth();
  // const router = useRouter(); // Descomente se precisar de redirecionamentos manuais aqui

  // Se ainda estiver carregando o estado de autenticação
  if (isLoading) {
    return <div className="p-8 text-white">Carregando...</div>;
  }

  // Uma verificação básica (idealmente, isso seria tratado por um layout protegido ou middleware)
  if (!currentUser || currentUser.user_type !== 'colaborador') {
    // Se por algum motivo um não colaborador ou usuário não logado chegar aqui,
    // o logout pode ser uma ação segura, ou redirecionar para o login.
    // logout(); // Descomentar se quiser forçar logout em caso de acesso indevido
    // return <div className="p-8 text-white">Acesso não autorizado ou sessão inválida. Redirecionando...</div>;
    // Por ora, confiamos que o fluxo de login e o AuthContext encaminharam corretamente.
  }

  const handleLogout = () => {
    logout(); // Chama a função de logout do AuthContext
  };

  return (
    <div className="p-8 text-white"> {/* Adicionado text-white */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard do Colaborador</h1>
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
          {/* Aqui você poderá adicionar a exibição do WorkInfo do colaborador no futuro */}
        </div>
      )}
      
    </div>
  );
}