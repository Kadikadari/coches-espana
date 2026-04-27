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
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter">CochesEspaña</Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="font-bold text-gray-600 hover:text-blue-600">Comprar</Link>
              {user ? (
                <Link href="/sell" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black">Publicar Anuncio</Link>
              ) : (
                <Link href="/login" className="bg-gray-100 text-gray-800 px-6 py-2.5 rounded-xl font-bold">Iniciar Sesión</Link>
              )}
            </nav>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16m-7 6h7" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-black mb-10">Anuncios destacados</h2>
        {loading ? <p>Cargando...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {filteredCars.map(car => (
              <Link href={`/cars/${car.id}`} key={car.id} className="bg-white rounded-3xl shadow-sm overflow-hidden border">
                <img src={car.images?.[0]} className="h-48 w-full object-cover" alt={car.brand} />
                <div className="p-6">
                  <h3 className="font-bold text-xl">{car.brand} {car.model}</h3>
                  <p className="text-2xl font-black text-blue-600">{car.price}€</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
