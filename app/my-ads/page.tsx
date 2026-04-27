'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function MyAdsPage() {
  const router = useRouter();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getMyAds() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setAds(data || []);
      setLoading(false);
    }
    getMyAds();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este anuncio?")) return;

    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Error al eliminar: " + error.message);
    } else {
      setAds(ads.filter(ad => ad.id !== id));
      alert("Anuncio eliminado correctamente.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <header className="bg-white shadow-sm py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter">CochesEspaña</Link>
          <Link href="/sell" className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold">Vender otro coche</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black mb-10 text-gray-900">Mis Anuncios</h1>

        {ads.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
            <p className="text-gray-400 text-xl font-bold italic mb-6">Aún no has publicado ningún anuncio.</p>
            <Link href="/sell" className="text-blue-600 font-black hover:underline text-lg">Publicar mi primer coche</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ads.map((ad) => (
              <div key={ad.id} className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-100 flex flex-col">
                <div className="relative h-48 w-full bg-gray-100">
                  {ad.images?.[0] && <img src={ad.images[0]} className="w-full h-full object-cover" alt={ad.brand} />}
                </div>
                <div className="p-6 flex-1">
                  <h3 className="text-xl font-bold mb-2">{ad.brand} {ad.model}</h3>
                  <p className="text-2xl font-black text-blue-600 mb-4">{ad.price}€</p>

                  <div className="flex gap-3 mt-auto pt-4 border-t border-gray-50">
                    <button
                      onClick={() => handleDelete(ad.id)}
                      className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-black text-sm hover:bg-red-600 hover:text-white transition-colors"
                    >
                      ELIMINAR
                    </button>
                    <Link
                      href={`/cars/${ad.id}`}
                      className="flex-1 bg-gray-50 text-gray-600 py-3 rounded-xl font-black text-center text-sm hover:bg-gray-100 transition-colors"
                    >
                      VER
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
