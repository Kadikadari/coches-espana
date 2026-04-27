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
  "Peugeot", "Citroën", "Ford", "Hyundai", "Kia", "Nissan", "Opel", "Fiat", "Tesla", "Volvo", "Porsche", "Jeep"
];

export default function Home() {
  const [cars, setCars] = useState<any[]>([]);
  const [filteredCars, setFilteredCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchBrand, setSearchBrand] = useState("Todos");
  const [searchLocation, setSearchLocation] = useState("Toda España");

  useEffect(() => {
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
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

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
      {/* Header - النسخة الاحترافية الكاملة */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-[100] w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter flex items-center gap-2">
            <span className="bg-blue-600 text-white p-1 rounded-lg">C</span> CochesEspaña
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="font-bold text-gray-600 hover:text-blue-600 transition">Comprar</Link>
            <Link href="/sell" className="font-bold text-gray-600 hover:text-blue-600 transition">Vender</Link>
            <Link href="/sell" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition font-black shadow-lg shadow-blue-100">
              Publicar Anuncio
            </Link>
          </nav>

          {/* Mobile Menu Button - واضح وقوي */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown - تصميم كامل العرض وسلس */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-gray-200 shadow-2xl z-[99] animate-in slide-in-from-top duration-300">
            <div className="p-6 space-y-4">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-3 text-lg font-bold text-gray-700 hover:text-blue-600 border-b border-gray-50">
                <span>Comprar</span>
              </Link>
              <Link href="/sell" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-3 text-lg font-bold text-gray-700 hover:text-blue-600 border-b border-gray-50">
                <span>Vender</span>
              </Link>
              <Link href="/sell" onClick={() => setIsMenuOpen(false)} className="block w-full bg-blue-600 text-white text-center py-4 rounded-2xl font-black shadow-lg active:scale-95 transition-transform">
                Publicar Anuncio
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section - تصميم غني */}
      <section className="bg-blue-600 text-white py-16 md:py-28 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,76.4,-44.7C83.6,-31.3,86.9,-15.6,85.5,-0.8C84.1,14,78,28,69.2,40.1C60.4,52.2,48.9,62.4,35.7,69.5C22.5,76.6,7.6,80.6,-7.4,79.3C-22.4,78,-37.5,71.4,-50.2,61.4C-62.9,51.4,-73.2,38,-78.9,22.8C-84.6,7.6,-85.7,-9.4,-81.2,-25.1C-76.7,-40.8,-66.6,-55.2,-53.2,-62.4C-39.8,-69.6,-23.1,-69.6,-7.4,-76.4C8.3,-83.2,26,-96.8,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter leading-none">
            Encuentra tu próximo <br className="hidden md:block" />
            <span className="text-orange-400">coche ideal</span> en España
          </h1>
          <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto font-medium">
            La plataforma líder con más de 10.000 vehículos verificados.
          </p>

          {/* Search Box - النسخة الكاملة */}
          <div className="bg-white p-3 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-3 items-stretch">
            <div className="flex-1 relative group">
              <select
                value={searchBrand}
                onChange={(e) => setSearchBrand(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-none bg-gray-50 text-gray-800 font-bold focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="Todos">Todas las marcas</option>
                {carBrands.sort().map(brand => <option key={brand} value={brand}>{brand}</option>)}
              </select>
            </div>
            <div className="w-full md:w-72 relative group">
              <select
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-none bg-gray-50 text-gray-800 font-bold focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="Toda España">Toda España</option>
                {spanishProvinces.sort().map(province => <option key={province} value={province}>{province}</option>)}
              </select>
            </div>
            <button
              onClick={handleSearch}
              className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 rounded-2xl font-black transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 transform active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              BUSCAR
            </button>
          </div>
        </div>
      </section>

      {/* Main Content - تصميم الكروت الكامل */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Anuncios recientes</h2>
            <p className="text-gray-500 mt-2 font-medium">Coches actualizados hace unos minutos.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-b-blue-600"></div>
            <p className="text-gray-400 font-bold animate-pulse">Cargando vehículos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCars.map((car) => (
              <Link href={`/cars/${car.id}`} key={car.id} className="bg-white rounded-[2rem] shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-500 block group border border-gray-100 transform hover:-translate-y-2">
                <div className="relative h-60 w-full bg-gray-200">
                   {car.image_url ? (
                     <img src={car.image_url} alt={car.brand} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-400">Sin foto</div>
                   )}
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black text-blue-600 shadow-sm uppercase tracking-widest">
                      Ocasión
                   </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition mb-2">{car.brand} {car.model}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-black text-blue-600">{car.price}</span>
                    <span className="text-blue-600 font-bold">€</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-gray-500 font-bold text-sm">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 2" strokeWidth="2" strokeLinecap="round"/></svg>
                      {car.year}
                    </span>
                    <span className="flex items-center gap-1 truncate max-w-[120px]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2"/></svg>
                      {car.location}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {!loading && filteredCars.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-400 text-xl font-bold italic">No hemos encontrado coches con esos filtros.</p>
            <button onClick={() => {setFilteredCars(cars); setSearchBrand("Todos"); setSearchLocation("Toda España");}} className="mt-4 text-blue-600 font-black hover:underline">Ver todos los coches</button>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-white py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center md:text-left grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="text-3xl font-black text-blue-500 mb-6 tracking-tighter">CochesEspaña</h4>
            <p className="text-gray-400 leading-relaxed font-medium">El portal de confianza para la compra-venta de vehículos en toda la geografía española.</p>
          </div>
          <div>
            <h5 className="font-black text-xl mb-6">Enlaces rápidos</h5>
            <div className="flex flex-col gap-4 font-bold text-gray-500">
              <Link href="/" className="hover:text-blue-400 transition">Comprar Coche</Link>
              <Link href="/sell" className="hover:text-blue-400 transition">Vender mi Coche</Link>
            </div>
          </div>
          <div>
            <h5 className="font-black text-xl mb-6">Localidades top</h5>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 text-xs font-bold text-gray-600">
              <span className="bg-gray-800 px-3 py-1 rounded-full">Madrid</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Barcelona</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Valencia</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Sevilla</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
