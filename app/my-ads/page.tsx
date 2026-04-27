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
      <header className="bg-white shadow-sm py-4 sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter italic">CochesEspaña</Link>
          <Link href="/sell" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition">Vender otro coche</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-10">
           <h1 className="text-4xl font-black text-gray-900 tracking-tight">Mis Anuncios</h1>
           <span className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">{ads.length} Publicados</span>
        </div>

        {ads.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
            <p className="text-gray-400 text-xl font-bold italic mb-8">Aún no has publicado ningún anuncio.</p>
            <Link href="/sell" className="inline-block bg-blue-50 text-blue-600 px-10 py-4 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all">Publicar mi primer coche</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ads.map((ad) => (
              <div key={ad.id} className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-100 flex flex-col group hover:shadow-2xl transition-all duration-500">
                <div className="relative h-56 w-full bg-gray-100">
                  {ad.images?.[0] ? (
                    <img src={ad.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt={ad.brand} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-black">SIN FOTO</div>
                  )}
                </div>
                <div className="p-8 flex-1">
                  <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition">{ad.brand} {ad.model}</h3>
                  <p className="text-3xl font-black text-blue-600 mb-6">{ad.price}€</p>

                  <div className="grid grid-cols-2 gap-3 mt-auto pt-6 border-t border-gray-50">
                    <Link
                      href={`/edit/${ad.id}`}
                      className="bg-orange-50 text-orange-600 py-4 rounded-2xl font-black text-center text-xs hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                    >
                      EDITAR
                    </Link>
                    <button
                      onClick={() => handleDelete(ad.id)}
                      className="bg-red-50 text-red-600 py-4 rounded-2xl font-black text-xs hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      ELIMINAR
                    </button>
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
