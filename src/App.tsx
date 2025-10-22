import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Auth } from './pages/Auth';
import { MedicineSearch } from './pages/MedicineSearch';
import { UserProfile } from './pages/UserProfile';

type Page = 'search' | 'profile';

function App() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('search');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <>
      {currentPage === 'search' && (
        <MedicineSearch onNavigateToProfile={() => setCurrentPage('profile')} />
      )}
      {currentPage === 'profile' && (
        <UserProfile onNavigateBack={() => setCurrentPage('search')} />
      )}
    </>
  );
}

export default App;
