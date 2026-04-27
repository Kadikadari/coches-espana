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
  const [searchBrand, setSearchBrand] = useState("Todos");
  const [searchLocation, setSearchLocation] = useState("Toda España");

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCars(data || []);
      setFilteredCars(data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = () => {
    let results = cars;
    if (searchBrand !== "Todos") {
      results = results.filter(car => car.brand === searchBrand);
    }
    if (searchLocation !== "Toda España") {
      results = results.filter(car => car.location === searchLocation);
    }
    setFilteredCars(results);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header التعديل الجذري هنا */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
          <Link href="/" className="text-xl md:text-2xl font-black text-blue-600 tracking-tighter">
            CochesEspaña
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-bold transition">Comprar</Link>
            <Link href="/sell" className="text-gray-600 hover:text-blue-600 font-bold transition">Vender</Link>
            <Link href="/sell" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition font-black shadow-lg shadow-blue-100">
              Publicar Anuncio
            </Link>
          </nav>

          {/* Mobile Menu Button - جعلناه أوضح */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
          >
            <span className="sr-only">Menu</span>
            {isMenuOpen ? (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown - كود أبجد هوز لضمان الظهور */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-2xl z-[99]">
            <div className="p-4 space-y-4">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="block py-3 text-lg font-bold text-gray-700 border-b border-gray-50">Comprar</Link>
              <Link href="/sell" onClick={() => setIsMenuOpen(false)} className="block py-3 text-lg font-bold text-gray-700 border-b border-gray-50">Vender</Link>
              <Link href="/sell" onClick={() => setIsMenuOpen(false)} className="block w-full bg-blue-600 text-white text-center py-4 rounded-2xl font-black shadow-lg mt-2">
                Publicar Anuncio
              </Link>
            </div>
          </div>
        )}
      </header>

      <section className="bg-blue-600 text-white py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-3xl md:text-6xl font-black mb-6 tracking-tight leading-tight">Coches de Segunda Mano en España</h1>
          <p className="text-lg md:text-xl mb-12 opacity-90 max-w-2xl mx-auto font-light">Encuentra las mejores ofertas de particulares en toda la península.</p>

          <div className="bg-white p-2 md:p-3 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 items-center">
            <div className="w-full flex-1 relative">
              <select
                value={searchBrand}
                onChange={(e) => setSearchBrand(e.target.value)}
                className="w-full px-4 py-4 rounded-xl border-none text-gray-800 focus:ring-0 appearance-none bg-gray-50"
              >
                <option value="Todos">Todas las marcas</option>
                {carBrands.sort().map(brand => <option key={brand} value={brand}>{brand}</option>)}
              </select>
            </div>
            <div className="w-full md:w-64 relative">
              <select
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full px-4 py-4 rounded-xl border-none text-gray-800 focus:ring-0 appearance-none bg-gray-50"
              >
                <option value="Toda España">Toda España</option>
                {spanishProvinces.sort().map(province => <option key={province} value={province}>{province}</option>)}
              </select>
            </div>
            <button
              onClick={handleSearch}
              className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-xl font-black transition shadow-lg"
            >
              BUSCAR
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-black mb-10">Últimos anuncios</h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredCars.map((car) => (
              <Link href={`/cars/${car.id}`} key={car.id} className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-2xl transition-all block group border border-gray-100">
                <div className="relative h-48 md:h-56 w-full bg-gray-100">
                   {car.image_url ? (
                     <img src={car.image_url} alt={car.brand} className="w-full h-full object-cover group-hover:scale-105 transition" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2"/></svg>
                     </div>
                   )}
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-1">{car.brand} {car.model}</h3>
                  <p className="text-2xl font-black text-blue-600 mb-4">{car.price}€</p>
                  <div className="flex items-center text-gray-500 text-sm gap-3">
                    <span>{car.year}</span>
                    <span>•</span>
                    <span>{car.location}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h4 className="text-2xl font-black mb-4 text-blue-500">CochesEspaña</h4>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">© 2024 El portal líder para la compra y venta de vehículos en España.</p>
          <div className="flex justify-center gap-6">
            <Link href="/" className="hover:text-blue-500 transition font-bold">Comprar</Link>
            <Link href="/sell" className="hover:text-blue-500 transition font-bold">Vender</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
