import { useState } from 'react';
import { Search, ExternalLink, User, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Medicine {
  id: string;
  brand_name: string;
  generic_name: string;
  buying_link: string; // optional, from Supabase if you want
}

interface MedicineSearchProps {
  onNavigateToProfile: () => void;
}

export function MedicineSearch({ onNavigateToProfile }: MedicineSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { signOut } = useAuth();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      // Step 1: Get RxCUI for the brand name
      const rxRes = await fetch(
        `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(searchTerm)}`
      );
      const rxData = await rxRes.json();
      const rxId = rxData.idGroup?.rxnormId?.[0];
      console.log(rxId)

      if (!rxId) {
        setMedicine(null);
        setLoading(false);
        return;
      }

      // Step 2: Get the generic name using RxCUI
      const genericRes = await fetch(
        `https://rxnav.nlm.nih.gov/REST/rxcui/${rxId}/related.json?rela=tradename_of`
      );
      const genericData = await genericRes.json();
      const genericName =
        genericData.relatedGroup?.conceptGroup?.[0]?.conceptProperties?.[0]?.name || 'Not Found';
        console.log(genericName)
        const tatalmgLink = `https://www.1mg.com/search/all?name=${encodeURIComponent(genericName)}`;

      // Optional: Get buying link from Supabase if you have a 'medicines' table
      const { data: dbData } = await supabase
        .from('medicines')
        .select('*')
        .ilike('brand_name', `%${searchTerm}%`)
        .maybeSingle();

      // Set medicine info for UI
      setMedicine({
        id: rxId,
        brand_name: searchTerm,
        generic_name: genericName,
        buying_link: tatalmgLink,
      });

      // Step 3: Save search history for authenticated user
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (userId) {
        await supabase.from('search_history').insert([
          { user_id: userId, brand_name: searchTerm },
        ]);
      }
    } catch (error) {
      console.error('Error searching medicine:', error);
      setMedicine(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Medimate
              </h1>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-full transition-colors duration-200"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigateToProfile();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Generic Alternatives</h2>
          <p className="text-lg text-gray-600">
            Search for brand name medicines and discover their affordable generic alternatives
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter brand medicine name (e.g., Advil, Tylenol)"
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-lg"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !searchTerm.trim()}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>{loading ? 'Searching...' : 'Search'}</span>
            </button>
          </div>
        </div>

        {searched && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Searching for generic alternatives...</p>
              </div>
            ) : medicine ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900">Results Found</h3>
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    Generic Available
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
                      Brand Name
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{medicine.brand_name}</p>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6">
                    <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-2">
                      Generic Name
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{medicine.generic_name}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6">
                  <p className="text-sm font-semibold text-teal-600 uppercase tracking-wide mb-3">
                    Buy Generic Alternative
                  </p>
                  <a
                    href={medicine.buying_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <span>View Buying Options</span>
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Always consult with your healthcare provider before switching from a brand name to a generic medicine.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-600">
                  We couldn't find a generic alternative for "{searchTerm}". Try searching with a different medicine name.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
