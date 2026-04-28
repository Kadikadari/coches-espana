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
        // 1. جلب بيانات المستخدم الحالي
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);

        // 2. زيادة المشاهدات عبر الدالة البرمجية (RPC)
        // نقوم بالزيادة فقط إذا لم يكن المستخدم هو صاحب الإعلان (أو إذا لم يكن مسجلاً)
        // سنجلب البيانات أولاً للتحقق من المالك
        const { data: initialData } = await supabase
          .from('cars')
          .select('user_id')
          .eq('id', id)
          .single();

        if (initialData && (!user || user.id !== initialData.user_id)) {
           await supabase.rpc('increment_views', { car_id: id });
        }

        // 3. جلب تفاصيل السيارة كاملة بعد الزيادة
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          setCar(data);
          document.title = `${data.brand} ${data.model} de segunda mano en ${data.location} | CochesEspaña`;

          // تحديث الـ SEO Meta
          const seoDesc = `Compra este ${data.brand} ${data.model} del año ${data.year} con ${data.km}km en ${data.location} por solo ${data.price}€.`;
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
          }
          metaDesc.setAttribute('content', seoDesc);
        }
      } catch (err) {
        console.error("Error fetching car details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCarDetails();
  }, [id]);

  const nextImage = () => {
    if (car?.images) setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const prevImage = () => {
    if (car?.images) setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-b-blue-600"></div></div>;
  if (!car) return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center"><h1 className="text-2xl font-black text-gray-800 mb-4">Vehículo no encontrado.</h1><Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold">Volver al inicio</Link></div>;

  const isOwner = currentUser && currentUser.id === car.user_id;
  const cleanPhone = (car.phone || "").replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone.startsWith('00') ? cleanPhone.substring(2) : cleanPhone}`;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white border-b border-gray-100 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-black tracking-tight">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            VOLVER
          </Link>
          {isOwner && (
            <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full flex items-center gap-2 border border-blue-100 animate-pulse">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              <span className="text-xs font-black uppercase tracking-wider">{car.views || 0} vistas</span>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative bg-black rounded-[2.5rem] h-[350px] md:h-[600px] overflow-hidden group shadow-2xl">
              {car.images && car.images.length > 0 ? (
                <>
                  <img src={car.images[currentImageIndex]} alt={`${car.brand} ${car.model}`} className="w-full h-full object-contain md:object-cover" />
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
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-black">SIN FOTO</div>
              )}
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-6">{car.brand} {car.model}</h1>
              <div className="flex flex-wrap gap-4 mb-10 pb-10 border-b border-gray-100">
                <div className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl font-black">{car.year}</div>
                <div className="bg-orange-50 text-orange-600 px-6 py-3 rounded-2xl font-black">{car.km} km</div>
                <div className="bg-gray-50 text-gray-600 px-6 py-3 rounded-2xl font-black">{car.location}</div>
              </div>
              <h2 className="text-2xl font-black mb-4 text-gray-900">Descripción completa</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-10 whitespace-pre-line font-medium">{car.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 sticky top-24">
              <p className="text-gray-400 font-bold mb-2 uppercase text-[10px] tracking-widest">Precio al contado</p>
              <p className="text-6xl font-black text-blue-600 tracking-tighter mb-8">{car.price}€</p>
              <div className="space-y-4">
                <a href={`tel:${car.phone}`} className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition shadow-xl">LLAMAR AHORA</a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366] text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-[#20ba59] transition shadow-xl">WHATSAPP</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
