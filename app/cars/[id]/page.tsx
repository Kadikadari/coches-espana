'use client';

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function CarDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
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
          .eq('id', id)
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
  }, [id]);

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

  // تنظيف رقم الواتساب برمجياً لضمان العمل حتى لو أدخل البائع 00 أو مسافات
  let cleanPhone = car.phone || "";
  // 1. إزالة كل ما ليس رقماً
  cleanPhone = cleanPhone.replace(/\D/g, '');
  // 2. إذا كان يبدأ بـ 00، استبدلها ببدابة الرقم الدولي مباشرة (بدون +)
  if (cleanPhone.startsWith('00')) {
    cleanPhone = cleanPhone.substring(2);
  }
  // 3. تأكد أن الرقم جاهز للرابط
  const whatsappUrl = `https://wa.me/${cleanPhone}`;

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
              <h2 className="text-2xl font-black mb-4 text-gray-900">Descripción</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-10 whitespace-pre-line font-medium">{car.description}</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 sticky top-24">
              <p className="text-gray-400 font-bold mb-2 uppercase text-[10px] tracking-widest">Precio al contado</p>
              <p className="text-6xl font-black text-blue-600 tracking-tighter mb-8">{car.price}€</p>
              <div className="space-y-4">
                <a href={`tel:${car.phone}`} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition shadow-xl transform hover:scale-[1.02] active:scale-[0.98]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  LLAMAR AHORA
                </a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-[#20ba59] transition shadow-xl transform hover:scale-[1.02] active:scale-[0.98]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
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
