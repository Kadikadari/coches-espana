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
  const [images, setImages] = useState<string[]>([]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;

      setUploading(true);
      const files = Array.from(e.target.files);
      const uploadedUrls: string[] = [...images];

      for (const file of files) {
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

        uploadedUrls.push(data.publicUrl);
      }

      setImages(uploadedUrls);
    } catch (error: any) {
      alert('Error subiendo imágenes: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Por favor, sube al menos una foto.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('cars')
      .insert([{ ...formData, images: images }]); // نرسل مصفوفة الصور هنا

    if (error) {
      alert("Error al publicar: " + error.message);
      setLoading(false);
    } else {
      setLoading(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-center font-sans">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-3xl font-black mb-2">¡Excelente!</h1>
          <p className="text-gray-500 mb-8">Tu anuncio con {images.length} fotos ha sido publicado.</p>
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
          <Link href="/" className="text-2xl font-black text-blue-600">CochesEspaña</Link>
          <Link href="/" className="text-gray-500 font-bold hover:text-blue-600 transition">Cancelar</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-4xl font-black mb-2 text-gray-900 tracking-tight">Publicar anuncio</h1>
          <p className="text-gray-500 mb-10 text-lg">Puedes subir hasta 10 fotos de tu vehículo.</p>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Multi-Image Upload Section */}
            <section className="space-y-6">
               <h2 className="text-xl font-black text-blue-600 flex items-center gap-2">📸 Fotos del coche ({images.length})</h2>

               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  {images.map((url, index) => (
                    <div key={index} className="relative aspect-video group">
                      <img src={url} className="w-full h-full object-cover rounded-2xl border border-gray-100 shadow-sm" alt="Preview" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round"/></svg>
                      </button>
                    </div>
                  ))}

                  {images.length < 10 && (
                    <div className="relative aspect-video border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                       <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3" strokeLinecap="round"/></svg>
                       <span className="text-xs font-bold text-gray-400 mt-2">{uploading ? "Subiendo..." : "Añadir foto"}</span>
                       <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={uploading}
                      />
                    </div>
                  )}
               </div>
               {uploading && <p className="text-blue-600 text-sm font-bold animate-pulse text-center">Subiendo imágenes, por favor espera...</p>}
            </section>

            <section className="space-y-6 pt-6 border-t border-gray-50">
              <h2 className="text-xl font-black text-blue-600">📝 Información y Precio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required name="brand" value={formData.brand} onChange={handleChange} placeholder="Marca" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
                <input required name="model" value={formData.model} onChange={handleChange} placeholder="Modelo" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
                <input required name="year" value={formData.year} onChange={handleChange} type="number" placeholder="Año" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
                <input required name="price" value={formData.price} onChange={handleChange} type="number" placeholder="Precio (€)" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 font-black text-blue-600 text-xl" />
              </div>
            </section>

            <section className="space-y-6 pt-6 border-t border-gray-50">
              <h2 className="text-xl font-black text-blue-600">📞 Datos de contacto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
                <select name="location" value={formData.location} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                  {spanishProvinces.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Descripción detallada..." className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 font-medium"></textarea>
            </section>

            <button
              type="submit"
              disabled={loading || uploading || images.length === 0}
              className={`w-full py-5 rounded-[2rem] font-black text-xl text-white transition-all shadow-2xl ${
                loading || uploading || images.length === 0 ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
              }`}
            >
              {loading ? "Publicando..." : images.length === 0 ? "Sube fotos para continuar" : "Publicar Anuncio"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
