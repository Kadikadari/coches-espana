'use client';

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const spanishProvinces = [
  "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Baleares", "Barcelona", "Burgos",
  "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ciudad Real", "Córdoba", "A Coruña", "Cuenca", "Girona", "Granada",
  "Guadalajara", "Guipúzcoa", "Huelva", "Huesca", "Jaén", "León", "Lleida", "Lugo", "Madrid", "Málaga",
  "Murcia", "Navarra", "Ourense", "Palencia", "Las Palmas", "Pontevedra", "La Rioja", "Salamanca", "Segovia", "Sevilla",
  "Soria", "Tarragona", "Santa Cruz de Tenerife", "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza", "Ceuta", "Melilla"
];

export default function SellPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    km: '',
    location: 'Madrid',
    fuel: 'Gasolina',
    transmission: 'Manual',
    description: '',
    phone: '',
    seller: ''
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('cars')
      .insert([formData]);

    if (error) {
      alert("Error al publicar el anuncio: " + error.message);
      setLoading(false);
    } else {
      setLoading(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-3xl font-black mb-2">¡Enhorabuena!</h1>
          <p className="text-gray-500 mb-8">Tu coche ha sido publicado con éxito y ya está visible en CochesEspaña.</p>
          <div className="space-y-3">
            <Link href="/" className="block w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition">
              Ver mi anuncio
            </Link>
            <button onClick={() => setSubmitted(false)} className="text-blue-600 font-bold hover:underline">
              Publicar otro vehículo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">CochesEspaña</Link>
          <Link href="/" className="text-gray-500 font-bold hover:text-blue-600 transition">Volver</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-4xl font-black mb-2 text-gray-900 tracking-tight">Vende tu coche hoy</h1>
          <p className="text-gray-500 mb-10 text-lg italic">Completa los datos y recibe llamadas de compradores interesados.</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="space-y-6">
              <h2 className="text-xl font-black text-blue-600 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-sm">1</span>
                Datos del Vehículo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 ml-1">Marca</label>
                  <input required name="brand" value={formData.brand} onChange={handleChange} type="text" placeholder="Ej. Seat" className="w-full px-5 py-3 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 ml-1">Modelo</label>
                  <input required name="model" value={formData.model} onChange={handleChange} type="text" placeholder="Ej. Ibiza" className="w-full px-5 py-3 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 ml-1">Año</label>
                  <input required name="year" value={formData.year} onChange={handleChange} type="number" placeholder="2022" className="w-full px-5 py-3 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 ml-1">Kms</label>
                  <input required name="km" value={formData.km} onChange={handleChange} type="number" placeholder="25000" className="w-full px-5 py-3 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition outline-none" />
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label className="text-sm font-bold text-gray-600 ml-1">Precio (€)</label>
                  <input required name="price" value={formData.price} onChange={handleChange} type="number" placeholder="15000" className="w-full px-5 py-3 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition outline-none font-bold text-blue-600" />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-black text-blue-600 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-sm">2</span>
                Especificaciones
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 ml-1">Combustible</label>
                  <select name="fuel" value={formData.fuel} onChange={handleChange} className="w-full px-5 py-3 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition outline-none appearance-none">
                    <option>Gasolina</option>
                    <option>Diésel</option>
                    <option>Híbrido</option>
                    <option>Eléctrico</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 ml-1">Caja de cambios</label>
                  <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full px-5 py-3 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition outline-none appearance-none">
                    <option>Manual</option>
                    <option>Automático</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 ml-1">Provincia</label>
                <select name="location" value={formData.location} onChange={handleChange} className="w-full px-5 py-3 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition outline-none appearance-none">
                  {spanishProvinces.sort().map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-black text-blue-600 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-sm">3</span>
                Contacto y Detalles
              </h2>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 ml-1">Nombre del vendedor</label>
                <input required name="seller" value={formData.seller} onChange={handleChange} type="text" placeholder="Tu nombre" className="w-full px-5 py-3 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 ml-1">Teléfono (WhatsApp)</label>
                <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="+34 000 000 000" className="w-full px-5 py-3 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 ml-1">Descripción</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Cuenta algo más sobre el coche..." className="w-full px-5 py-3 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition outline-none"></textarea>
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black text-xl transition shadow-2xl flex items-center justify-center gap-3 ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 transform hover:scale-[1.02] active:scale-[0.98]'
              } text-white`}
            >
              {loading ? "Publicando..." : "Publicar mi Coche"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
