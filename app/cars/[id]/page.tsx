'use client';

import { useState } from "react";
import Link from "next/link";

const cars = [
  {
    id: 1,
    brand: "Seat",
    model: "Ibiza",
    year: 2022,
    price: "15,500€",
    location: "Madrid",
    description: "Seat Ibiza en perfecto estado. Un solo propietario, siempre en garaje. Revisiones al día en taller oficial. Bajo consumo y muy fácil de conducir en ciudad. Incluye sistema de navegación y sensores de aparcamiento.",
    phone: "+34 600 000 000",
    seller: "Juan Pérez",
    km: "25,000 km",
    fuel: "Gasolina",
    transmission: "Manual",
    images: [
      "https://images.unsplash.com/photo-1617650728468-8581e439c864?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 2,
    brand: "Volkswagen",
    model: "Golf",
    year: 2021,
    price: "22,000€",
    location: "Barcelona",
    description: "Volkswagen Golf GTI performance. Equipamiento completo, techo solar, asientos deportivos. Muy bien cuidado.",
    phone: "+34 611 111 111",
    seller: "María García",
    km: "40,000 km",
    fuel: "Diésel",
    transmission: "Automático",
    images: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800"
    ]
  },
];

export default function CarDetails({ params }: { params: { id: string } }) {
  const car = cars.find(c => c.id.toString() === params.id) || cars[0];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-bold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Volver al listado
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">
            {/* Image Slider */}
            <div className="relative bg-black rounded-3xl h-[300px] md:h-[500px] overflow-hidden group shadow-2xl">
              <img
                src={car.images[currentImageIndex]}
                alt={`${car.brand} image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-500"
              />

              {/* Image Counter Badge */}
              <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold border border-white/20 z-10">
                {currentImageIndex + 1} / {car.images.length}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition opacity-0 group-hover:opacity-100 border border-white/10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition opacity-0 group-hover:opacity-100 border border-white/10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>

              {/* Progress Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {car.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/40'}`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">{car.brand} {car.model}</h1>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl">
                   <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2"/></svg>
                   <span className="font-bold text-gray-700">{car.year}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl">
                   <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2"/></svg>
                   <span className="font-bold text-gray-700">{car.km}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl">
                   <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2"/></svg>
                   <span className="font-bold text-gray-700">{car.location}</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">Descripción</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-10 whitespace-pre-line">
                {car.description}
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">Ficha técnica</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-1">Combustible</p>
                  <p className="font-bold text-gray-800 text-lg">{car.fuel}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-1">Cambio</p>
                  <p className="font-bold text-gray-800 text-lg">{car.transmission}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-1">Vendedor</p>
                  <p className="font-bold text-gray-800 text-lg">{car.seller}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 sticky top-24">
              <div className="mb-8">
                <p className="text-gray-400 font-medium mb-1 uppercase text-xs tracking-widest">Precio contado</p>
                <p className="text-5xl font-black text-blue-600 tracking-tighter">{car.price}</p>
              </div>

              <div className="space-y-4">
                <a href={`tel:${car.phone}`} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition shadow-lg shadow-blue-200 transform hover:scale-[1.02] active:scale-[0.98]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  LLAMAR AHORA
                </a>

                <button className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-[#20ba59] transition shadow-lg shadow-green-100 transform hover:scale-[1.02] active:scale-[0.98]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WHATSAPP
                </button>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center uppercase tracking-[0.2em] font-black mb-6">Ubicación aproximada</p>
                <div className="relative h-40 bg-gray-100 rounded-3xl overflow-hidden border border-gray-50 group cursor-pointer">
                  <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-transparent transition-colors"></div>
                  <div className="w-full h-full flex items-center justify-center text-blue-600 font-bold gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                    Ver en mapa
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
