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
  const [uploading, setUploading] = useState(false);
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
    seller: '',
    image_url: ''
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('car-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
    } catch (error: any) {
      alert('Error subiendo imagen: ' + error.message);
    } finally {
      setUploading(false);
    }
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
          <p className="text-gray-500 mb-8">Tu anuncio ha sido publicado con éxito.</p>
          <Link href="/" className="block w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">CochesEspaña</Link>
          <Link href="/" className="text-gray-500 font-bold hover:text-blue-600 transition">Volver</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-4xl font-black mb-2 text-gray-900">Vende tu coche</h1>
          <p className="text-gray-500 mb-10 text-lg">Introduce los datos y sube una foto real.</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="space-y-6">
               <h2 className="text-xl font-black text-blue-600">1. Fotos del vehículo</h2>
               <div className="relative border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer overflow-hidden">
                  {formData.image_url ? (
                    <div className="space-y-4">
                      <img src={formData.image_url} className="mx-auto h-48 rounded-xl object-cover shadow-lg" alt="Preview" />
                      <p className="text-green-600 font-bold text-sm">✓ Foto lista</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <p className="text-gray-600 font-medium">{uploading ? "Subiendo..." : "Haz clic para subir la foto principal"}</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
               </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-black text-blue-600">2. Información técnica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required name="brand" value={formData.brand} onChange={handleChange} placeholder="Marca (Ej: Seat)" className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500" />
                <input required name="model" value={formData.model} onChange={handleChange} placeholder="Modelo (Ej: Ibiza)" className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500" />
                <input required name="year" value={formData.year} onChange={handleChange} type="number" placeholder="Año" className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500" />
                <input required name="price" value={formData.price} onChange={handleChange} type="number" placeholder="Precio (€)" className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-black text-blue-600">3. Contacto</h2>
              <input required name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono / WhatsApp" className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500" />
              <select name="location" value={formData.location} onChange={handleChange} className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500">
                {spanishProvinces.map(p => <option key={p}>{p}</option>)}
              </select>
              <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Descripción del vehículo..." className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </section>

            <button
              type="submit"
              disabled={loading || uploading || !formData.image_url}
              className={`w-full py-5 rounded-2xl font-black text-xl text-white transition shadow-xl ${
                loading || uploading || !formData.image_url ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
              }`}
            >
              {loading ? "Publicando..." : !formData.image_url ? "Sube una foto para continuar" : "Publicar Anuncio"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
