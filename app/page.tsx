'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const spanishProvinces = [
  "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Baleares", "Barcelona", "Burgos",
  "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ciudad Real", "Córdoba", "A Coruña", "Cuenca", "Girona", "Granada",
  "Guadalajara", "Guipúzcoa", "Huelva", "Huesca", "Jaén", "León", "Lleida", "Lugo", "Madrid", "Málaga",
  "Murcia", "Navarra", "Ourense", "Palencia", "Las Palmas", "Pontevedra", "La Rioja", "Salamanca", "Segovia", "Sevilla",
  "Soria", "Tarragona", "Santa Cruz de Tenerife", "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza", "Ceuta", "Melilla"
];

const carBrands = [
  "Seat", "Volkswagen", "Renault", "Toyota", "BMW", "Audi", "Mercedes-Benz",
  "Peugeot", "Citroën", "Ford", "Hyundai", "Kia", "Nissan", "Opel", "Fiat", "Tesla", "Volvo"
];

export default function Home() {
  const [cars, setCars] = useState<any[]>([]);
  const [filteredCars, setFilteredCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      fetchCars();
    }
    init();
  }, []);

  async function fetchCars() {
    setLoading(true);
    const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
    if (!error) {
      setCars(data || []);
      setFilteredCars(data || []);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-[100] w-full">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex justify-between items-center relative">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter">CochesEspaña</Link>

          <div className="flex items-center gap-4">
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="font-bold text-gray-600 hover:text-blue-600 transition">Comprar</Link>
              {user ? (
                <Link href="/sell" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black shadow-lg">Publicar Anuncio</Link>
              ) : (
                <Link href="/login" className="bg-gray-100 text-gray-800 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition">Iniciar Sesión</Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 {isMenuOpen
                   ? <path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" />
                   : <path d="M4 6h16M4 12h16m-7 6h7" strokeWidth="2.5" strokeLinecap="round" />
                 }
               </svg>
            </button>
          </div>

          {/* Mobile Menu Dropdown - هذا هو الكود الناقص الذي أضفته الآن */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-2xl md:hidden z-[99] p-4 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="py-3 px-4 font-bold text-gray-700 hover:bg-gray-50 rounded-xl">Comprar</Link>
              {user ? (
                <Link href="/sell" onClick={() => setIsMenuOpen(false)} className="bg-blue-600 text-white text-center py-4 rounded-2xl font-black shadow-lg">Publicar Anuncio</Link>
              ) : (
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="bg-blue-600 text-white text-center py-4 rounded-2xl font-black shadow-lg">Iniciar Sesión</Link>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-blue-600 rounded-[2rem] p-10 text-white text-center mb-16 shadow-2xl">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">Compra y Venta en España</h1>
          <p className="text-xl opacity-80 font-medium">Encuentra tu próximo coche hoy mismo.</p>
        </div>

        <h2 className="text-3xl font-black mb-10 text-gray-900">Últimos anuncios</h2>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {cars.map((car) => (
              <Link href={`/cars/${car.id}`} key={car.id} className="bg-white rounded-[2rem] shadow-sm overflow-hidden hover:shadow-2xl transition-all border border-gray-100 block group">
                <div className="h-56 w-full relative">
                   {car.images && car.images[0] ? (
                     <img src={car.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={car.brand} />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-black">SIN FOTO</div>
                   )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{car.brand} {car.model}</h3>
                  <p className="text-2xl font-black text-blue-600 mb-4">{car.price}€</p>
                  <div className="flex items-center text-gray-500 text-sm gap-3 font-bold">
                    <span>{car.year}</span>
                    <span>•</span>
                    <span className="truncate">{car.location}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
