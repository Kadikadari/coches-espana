'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../lib/supabase";

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

  const [searchBrand, setSearchBrand] = useState("Todos");
  const [searchLocation, setSearchLocation] = useState("Toda España");

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

  const handleSearch = () => {
    let results = cars;
    if (searchBrand !== "Todos") results = results.filter(car => car.brand === searchBrand);
    if (searchLocation !== "Toda España") results = results.filter(car => car.location === searchLocation);
    setFilteredCars(results);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-[100] w-full">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter">CochesEspaña</Link>

          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="font-bold text-gray-600 hover:text-blue-600 transition">Comprar</Link>
              {user ? (
                <>
                  <Link href="/sell" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition font-black shadow-lg shadow-blue-100">Publicar Anuncio</Link>
                  <button onClick={() => supabase.auth.signOut().then(() => window.location.reload())} className="text-sm font-bold text-gray-400">Salir</button>
                </>
              ) : (
                <Link href="/login" className="bg-gray-100 text-gray-800 px-6 py-2.5 rounded-xl hover:bg-gray-200 transition font-bold">Iniciar Sesión</Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-16 bg-white border-b shadow-2xl z-[99]">
            <div className="p-6 space-y-4">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="block py-3 text-lg font-bold">Comprar</Link>
              {user ? (
                <>
                  <Link href="/sell" onClick={() => setIsMenuOpen(false)} className="block w-full bg-blue-600 text-white text-center py-4 rounded-2xl font-black">Publicar Anuncio</Link>
                  <button onClick={() => supabase.auth.signOut().then(() => window.location.reload())} className="block w-full py-2 text-center text-red-500 font-bold">Cerrar Sesión</button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block w-full bg-blue-600 text-white text-center py-4 rounded-2xl font-black">Iniciar Sesión</Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16 md:py-24 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Vende y Compra Coche en España</h1>
          {!user && (
            <Link href="/login" className="inline-block bg-orange-500 text-white px-8 py-3 rounded-full font-black mb-10 shadow-lg hover:bg-orange-600 transition">Regístrate para publicar gratis</Link>
          )}

          <div className="bg-white p-3 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-3">
            <select value={searchBrand} onChange={(e) => setSearchBrand(e.target.value)} className="flex-1 p-4 rounded-xl border-none bg-gray-50 text-gray-800 font-bold">
              <option value="Todos">Todas las marcas</option>
              {carBrands.sort().map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} className="flex-1 p-4 rounded-xl border-none bg-gray-50 text-gray-800 font-bold">
              <option value="Toda España">Toda España</option>
              {spanishProvinces.sort().map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <button onClick={handleSearch} className="md:w-48 bg-orange-500 text-white p-4 rounded-xl font-black shadow-lg">BUSCAR</button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-black mb-10 text-gray-900">Anuncios destacados</h2>
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCars.map((car) => (
              <Link href={`/cars/${car.id}`} key={car.id} className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-2xl transition-all block border border-gray-100 group">
                <div className="relative h-56 w-full">
                   {car.images && car.images[0] ? (
                     <img src={car.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={car.brand} />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs uppercase font-black">Sin foto</div>
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
