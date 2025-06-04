'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Ajustado para importar de 'auth-context.tsx'
import { useAuth } from '../../contexts/auth-context'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null); 
  const [isFormLoading, setIsFormLoading] = useState(false);
  
  const { login, isLoggedIn, currentUser, isLoading: authIsLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authIsLoading && isLoggedIn()) {
      if (currentUser?.user_type === 'master') {
        router.push('/master/dashboard');
      } else if (currentUser?.user_type === 'colaborador') {
        router.push('/collaborator/dashboard');
      }
    }
  }, [authIsLoading, isLoggedIn, currentUser, router]);


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsFormLoading(true);
    setFormError(null);

    try {
      await login({ email, password });
    } catch (err: any) {
      setFormError(err.message || 'Falha ao tentar fazer login.');
    } finally {
      setIsFormLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
      <div className="p-8 bg-gray-800 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seuemail@exemplo.com"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Sua senha"
            />
          </div>
          {formError && ( 
            <p className="text-red-400 text-xs italic mb-4 text-center">{formError}</p>
          )}
          <button
            type="submit"
            disabled={isFormLoading || authIsLoading} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {(isFormLoading || authIsLoading) ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}