'use client';

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function CarDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function fetchCarDetails() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);

        const { data: initialData } = await supabase.from('cars').select('user_id').eq('id', id).single();
        if (initialData && (!user || user.id !== initialData.user_id)) {
           await supabase.rpc('increment_views', { car_id: id });
        }

        const { data, error } = await supabase.from('cars').select('*').eq('id', id).single();
        if (!error && data) {
          setCar(data);
          document.title = `${data.brand} ${data.model} | CochesEspaña`;
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCarDetails();
  }, [id]);

  const nextImage = () => car?.images && setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
  const prevImage = () => car?.images && setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-b-transparent"></div></div>;
  if (!car) return <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center"><h1 className="text-2xl font-black mb-4">No encontrado</h1><Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-2xl">Volver</Link></div>;

  const isOwner = currentUser && currentUser.id === car.user_id;
  const whatsappUrl = `https://wa.me/${(car.phone || "").replace(/\D/g, '')}`;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white border-b border-gray-100 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-blue-600 flex items-center gap-2 font-black">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            VOLVER
          </Link>
          {isOwner && (
            <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full flex items-center gap-2 border border-blue-100 font-black text-xs uppercase">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              {car.views || 0} vistas
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative bg-black rounded-[2.5rem] h-[350px] md:h-[600px] overflow-hidden group shadow-2xl">
              {car.images?.length > 0 ? (
                <>
                  <img src={car.images[currentImageIndex]} className="w-full h-full object-contain" alt={car.brand} />
                  {car.images.length > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-4 rounded-full">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-4 rounded-full">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </>
                  )}
                </>
              ) : ( <div className="w-full h-full flex items-center justify-center text-gray-400">SIN FOTO</div> )}
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tighter">{car.brand} {car.model}</h1>

              {/* الخانات الجديدة لعرض جميع المعلومات */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 pb-10 border-b border-gray-100">
                <div className="bg-blue-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Año</p>
                  <p className="text-lg font-black text-blue-700">{car.year}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Kilómetros</p>
                  <p className="text-lg font-black text-orange-700">{car.km} km</p>
                </div>
                <div className="bg-green-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">Combustible</p>
                  <p className="text-lg font-black text-green-700">{car.fuel}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Cambio</p>
                  <p className="text-lg font-black text-purple-700">{car.transmission}</p>
                </div>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Ubicación
                </h2>
                <p className="text-xl font-bold text-gray-700 ml-8">{car.location}</p>
              </div>

              <h2 className="text-2xl font-black mb-4">Descripción</h2>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line font-medium bg-gray-50 p-6 rounded-3xl">{car.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 sticky top-24 text-center">
              <p className="text-gray-400 font-bold mb-2 uppercase text-[10px] tracking-widest">Precio Final</p>
              <p className="text-6xl font-black text-blue-600 mb-8 tracking-tighter">{car.price}€</p>
              <div className="space-y-4">
                <a href={`tel:${car.phone}`} className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-xl">LLAMAR</a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366] text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-xl">WHATSAPP</a>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-100">
                <p className="text-sm font-bold text-gray-400 mb-1">Vendedor</p>
                <p className="text-xl font-black text-gray-800">{car.seller}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
