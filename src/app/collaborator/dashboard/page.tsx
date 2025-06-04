'use client'; // Necessário para usar hooks e interatividade

import { useState, useEffect } from 'react'; // Adicionado useEffect se não estava
// import { useRouter } from 'next/navigation'; // Não está sendo usado neste trecho
import { useAuth } from '../../../contexts/auth-context'; // Ou use o alias @/ se configurado
import CalendarView from '../../../components/calendar/calendar-view'; // IMPORTA O CALENDÁRIO

interface SimpleWorkInfo {
  weekday_off: string;
  weekend_day_off: string;
  team?: string;
  position?: string;
  default_shift?: string;
}

export default function CollaboratorDashboardPage() {
  const { currentUser, logout, isLoading: authIsLoading } = useAuth();
  const [currentDisplayDate, setCurrentDisplayDate] = useState(new Date());
  const [collaboratorWorkInfo, setCollaboratorWorkInfo] = useState<SimpleWorkInfo | undefined>(undefined);
  const [pageIsLoading, setPageIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.work_info) {
        console.log("WorkInfo from currentUser:", currentUser.work_info);
        setCollaboratorWorkInfo({
          weekday_off: currentUser.work_info.weekday_off?.toLowerCase() || '',
          weekend_day_off: currentUser.work_info.weekend_day_off?.toLowerCase() || '',
          team: currentUser.work_info.team,
          position: currentUser.work_info.position,
          default_shift: currentUser.work_info.default_shift,
        });
      } else {
        console.warn("WorkInfo não encontrado no currentUser. Implementar busca da API.");
      }
    }
    setPageIsLoading(false);
  }, [currentUser]);


  const handlePrevMonth = () => {
    setCurrentDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleLogout = () => {
    logout();
  };

  if (authIsLoading || pageIsLoading) {
    return <div className="p-8 text-white text-center">Carregando dados...</div>;
  }

  if (!currentUser || currentUser.user_type !== 'colaborador') {
    return <div className="p-8 text-white text-center">Acesso não autorizado.</div>;
  }

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  return (
    <div className="p-4 md:p-8 text-white min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-xl md:text-3xl font-bold text-center sm:text-left">Minha Escala</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 md:px-4 rounded-md text-sm w-full sm:w-auto"
        >
          Sair
        </button>
      </div>

      {currentUser && (
        <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">
            Olá, {currentUser.name}!
          </h2>
          {collaboratorWorkInfo ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <p><span className="text-gray-400">Equipe:</span> {collaboratorWorkInfo.team || 'N/A'}</p>
              <p><span className="text-gray-400">Cargo:</span> {collaboratorWorkInfo.position || 'N/A'}</p>
              <p><span className="text-gray-400">Turno Padrão:</span> {collaboratorWorkInfo.default_shift || 'N/A'}</p>
              <p><span className="text-gray-400">Folga Semanal:</span> {collaboratorWorkInfo.weekday_off || 'N/A'}</p>
              <p><span className="text-gray-400">Folga Fim de Semana:</span> {collaboratorWorkInfo.weekend_day_off || 'N/A'}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Informações de trabalho não disponíveis ou ainda carregando.</p>
          )}
        </div>
      )}

      <div className="bg-gray-850 p-2 sm:p-4 md:p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4 px-2">
          <button onClick={handlePrevMonth} className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-lg font-bold">&lt;</button>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
            {monthNames[currentDisplayDate.getMonth()]} {currentDisplayDate.getFullYear()}
          </h2>
          <button onClick={handleNextMonth} className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-lg font-bold">&gt;</button>
        </div>
        {collaboratorWorkInfo ? (
          <CalendarView // << USO DO COMPONENTE
            year={currentDisplayDate.getFullYear()}
            month={currentDisplayDate.getMonth()}
            workInfo={collaboratorWorkInfo}
          />
        ) : (
          <p className="text-center text-gray-400 py-10">Carregando dados da escala...</p>
        )}
      </div>
    </div>
  );
}