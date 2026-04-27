'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const spanishProvinces = [
  "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Baleares", "Barcelona", "Burgos",
  "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ciudad Real", "Córdoba", "A Coruña", "Cuenca", "Girona", "Granada",
  "Guadalajara", "Guipúzcoa", "Huelva", "Huesca", "Jaén", "León", "Lleida", "Lugo", "Madrid", "Málaga",
  "Murcia", "Navarra", "Ourense", "Palencia", "Las Palmas", "Pontevedra", "La Rioja", "Salamanca", "Segovia", "Sevilla",
  "Soria", "Tarragona", "Santa Cruz de Tenerife", "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza", "Ceuta", "Melilla"
];

const carBrands = [
  "Seat", "Volkswagen", "Renault", "Toyota", "BMW", "Audi", "Mercedes-Benz",
  "Peugeot", "Citroën", "Ford", "Hyundai", "Kia", "Nissan", "Opel", "Fiat",
  "Alfa Romeo", "Aston Martin", "Bentley", "Cupra", "Dacia", "DS", "Ferrari", "Honda", "Jaguar", "Jeep",
  "Lamborghini", "Land Rover", "Lexus", "Maserati", "Mazda", "Mini", "Mitsubishi", "Porsche", "Skoda", "Smart", "Subaru", "Suzuki", "Tesla", "Volvo"
];

const initialCars = [
  {
    id: 1,
    brand: "Seat",
    model: "Ibiza",
    year: 2022,
    price: "15,500€",
    location: "Madrid",
    image: "https://images.unsplash.com/photo-1617650728468-8581e439c864?auto=format&fit=crop&q=80&w=600",
    badge: "Ocasión"
  },
  {
    id: 2,
    brand: "Volkswagen",
    model: "Golf",
    year: 2021,
    price: "22,000€",
    location: "Barcelona",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=600",
    badge: "Garantía"
  },
  {
    id: 3,
    brand: "Renault",
    model: "Clio",
    year: 2023,
    price: "18,900€",
    location: "Valencia",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600",
    badge: "Km 0"
  },
  {
    id: 4,
    brand: "Toyota",
    model: "Corolla",
    year: 2020,
    price: "19,500€",
    location: "Sevilla",
    image: "https://images.unsplash.com/photo-1621335829175-95f437384d7c?auto=format&fit=crop&q=80&w=600",
    badge: "Híbrido"
  },
  {
    id: 5,
    brand: "BMW",
    model: "Serie 3",
    year: 2019,
    price: "28,500€",
    location: "Madrid",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=600",
    badge: "Premium"
  },
  {
    id: 6,
    brand: "Audi",
    model: "A3",
    year: 2022,
    price: "26,000€",
    location: "Málaga",
    image: "https://images.unsplash.com/photo-1606152421647-dec9b64627b0?auto=format&fit=crop&q=80&w=600",
    badge: "Nuevo"
  },
];

export default function Home() {
  const [filteredCars, setFilteredCars] = useState(initialCars);
  const [searchBrand, setSearchBrand] = useState("Todos");
  const [searchLocation, setSearchLocation] = useState("Toda España");

  const handleSearch = () => {
    let results = initialCars;
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
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">CochesEspaña</Link>
          <nav className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Comprar</Link>
            <Link href="/sell" className="text-gray-600 hover:text-blue-600 font-medium transition">Vender</Link>
            <Link href="/sell" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition font-bold shadow-md shadow-blue-100">Publicar Anuncio</Link>
          </nav>
        </div>
      </header>

      <section className="bg-blue-600 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 L100 0 L100 100 Z" fill="white" />
          </svg>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Tu próximo coche te espera</h2>
          <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto font-light">La plataforma más segura y rápida para comprar vehículos de ocasión en toda España.</p>

          <div className="bg-white p-2 md:p-3 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 items-center">
            <div className="w-full flex-1 relative group">
              <select
                value={searchBrand}
                onChange={(e) => setSearchBrand(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-none text-gray-800 focus:ring-0 appearance-none bg-gray-50 group-hover:bg-gray-100 transition"
              >
                <option value="Todos">Todas las marcas</option>
                {carBrands.sort().map(brand => <option key={brand} value={brand}>{brand}</option>)}
              </select>
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              </div>
            </div>
            <div className="hidden md:block w-px h-10 bg-gray-200"></div>
            <div className="w-full md:w-64 relative group">
              <select
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-none text-gray-800 focus:ring-0 appearance-none bg-gray-50 group-hover:bg-gray-100 transition"
              >
                <option value="Toda España">Toda España</option>
                {spanishProvinces.sort().map(province => <option key={province} value={province}>{province}</option>)}
              </select>
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-xl font-black transition shadow-lg flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              BUSCAR
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h3 className="text-3xl font-black mb-2">Destacados de hoy</h3>
            <p className="text-gray-500">Explora las mejores ofertas verificadas en tu zona.</p>
          </div>
          {(searchBrand !== "Todos" || searchLocation !== "Toda España") && (
            <button
              onClick={() => {setFilteredCars(initialCars); setSearchBrand("Todos"); setSearchLocation("Toda España");}}
              className="text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1 mb-2 bg-blue-50 px-4 py-2 rounded-lg transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCars.map((car) => (
            <Link href={`/cars/${car.id}`} key={car.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 block group transform hover:-translate-y-2">
              <div className="relative h-56 w-full">
                 <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                 <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-blue-600 shadow-sm uppercase tracking-wider">
                    {car.badge}
                 </div>
                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="p-5">
                <h4 className="text-xl font-bold group-hover:text-blue-600 transition mb-1">{car.brand} {car.model}</h4>
                <div className="flex items-center text-gray-400 text-sm mb-4 gap-3">
                  <span className="flex items-center gap-1 font-medium italic"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2"/></svg>{car.year}</span>
                  <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2"/></svg>{car.location}</span>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  <span className="text-2xl font-black text-blue-600 tracking-tight">{car.price}</span>
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-inner">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-gray-800 pb-12">
            <div className="col-span-1 md:col-span-1">
              <h4 className="text-2xl font-black mb-6 text-blue-500">CochesEspaña</h4>
              <p className="text-gray-400 leading-relaxed">Simplificamos la compra y venta de vehículos en España con transparencia y tecnología.</p>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-lg">Comprar</h5>
              <ul className="text-gray-500 space-y-4">
                <li className="hover:text-blue-400 cursor-pointer transition">Coches de Ocasión</li>
                <li className="hover:text-blue-400 cursor-pointer transition">Coches Km 0</li>
                <li className="hover:text-blue-400 cursor-pointer transition">Coches de Lujo</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-lg">Vender</h5>
              <ul className="text-gray-500 space-y-4">
                <li className="hover:text-blue-400 cursor-pointer transition">Anuncio Gratis</li>
                <li className="hover:text-blue-400 cursor-pointer transition">Tasación Online</li>
                <li className="hover:text-blue-400 cursor-pointer transition">Consejos de Venta</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-lg">Síguenos</h5>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition cursor-pointer">F</div>
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-400 transition cursor-pointer">T</div>
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition cursor-pointer">I</div>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm">
            <p>© 2024 CochesEspaña. Hecho con pasión por el motor en España.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
