'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function CarDetails({ params }: { params: { id: string } }) {
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function fetchCarDetails() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('id', params.id)
          .single();

        if (!error) {
          setCar(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCarDetails();
  }, [params.id]);

  const nextImage = () => {
    if (car?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
    }
  };

  const prevImage = () => {
    if (car?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-b-blue-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h1 className="text-2xl font-black text-gray-800 mb-4">Vehículo no encontrado.</h1>
        <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white border-b border-gray-100 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-black tracking-tight">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            VOLVER
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2 space-y-8">
            <div className="relative bg-black rounded-[2.5rem] h-[350px] md:h-[600px] overflow-hidden group shadow-2xl">
              {car.images && car.images.length > 0 ? (
                <>
                  <img
                    src={car.images[currentImageIndex]}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-contain md:object-cover"
                  />
                  {car.images.length > 1 && (
                    <>
                      <div className="absolute bottom-8 right-8 bg-black/60 backdrop-blur-xl text-white px-5 py-2 rounded-full text-xs font-black border border-white/10 z-10">
                        {currentImageIndex + 1} / {car.images.length}
                      </div>
                      <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-4 rounded-full transition opacity-0 group-hover:opacity-100">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-4 rounded-full transition opacity-0 group-hover:opacity-100">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">Sin imágenes</div>
              )}
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-6">{car.brand} {car.model}</h1>
              <div className="flex flex-wrap gap-4 mb-10 pb-10 border-b border-gray-100">
                <div className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl font-black">{car.year}</div>
                <div className="bg-orange-50 text-orange-600 px-6 py-3 rounded-2xl font-black">{car.km} km</div>
                <div className="bg-gray-50 text-gray-600 px-6 py-3 rounded-2xl font-black">{car.location}</div>
              </div>
              <h2 className="text-2xl font-black mb-4">Descripción</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-10 whitespace-pre-line">{car.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 sticky top-24">
              <p className="text-gray-400 font-bold mb-2 uppercase text-[10px] tracking-widest">Precio al contado</p>
              <p className="text-6xl font-black text-blue-600 tracking-tighter mb-8">{car.price}€</p>

              <div className="space-y-4">
                <a href={`tel:${car.phone}`} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition shadow-xl">
                  LLAMAR AHORA
                </a>
                <a href={`https://wa.me/${car.phone?.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-[#20ba59] transition shadow-xl">
                  WHATSAPP
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
