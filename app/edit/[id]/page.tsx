'use client';

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const spanishProvinces = [
  "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Baleares", "Barcelona", "Burgos",
  "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ciudad Real", "Córdoba", "A Coruña", "Cuenca", "Girona", "Granada",
  "Guadalajara", "Guipúzcoa", "Huelva", "Huesca", "Jaén", "León", "Lleida", "Lugo", "Madrid", "Málaga",
  "Murcia", "Navarra", "Ourense", "Palencia", "Las Palmas", "Pontevedra", "La Rioja", "Salamanca", "Segovia", "Sevilla",
  "Soria", "Tarragona", "Santa Cruz de Tenerife", "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza", "Ceuta", "Melilla"
];

export default function EditAdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setLoadingSaving] = useState(false);
  const [images, setImages] = useState<string[]>([]);
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
    seller: ''
  });

  useEffect(() => {
    async function fetchAd() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        alert("No tienes permiso para editar este anuncio.");
        router.push("/my-ads");
      } else {
        setFormData({
          brand: data.brand,
          model: data.model,
          year: data.year,
          price: data.price,
          km: data.km,
          location: data.location,
          fuel: data.fuel,
          transmission: data.transmission,
          description: data.description,
          phone: data.phone,
          seller: data.seller
        });
        setImages(data.images || []);
      }
      setLoading(false);
    }
    fetchAd();
  }, [id, router]);

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
        const { error: uploadError } = await supabase.storage.from('car-images').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('car-images').getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      }
      setImages(uploadedUrls);
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) { alert("Sube al menos una foto."); return; }
    setLoadingSaving(true);

    const { error } = await supabase
      .from('cars')
      .update({ ...formData, images })
      .eq('id', id);

    if (error) {
      alert("Error al actualizar: " + error.message);
      setLoadingSaving(false);
    } else {
      alert("¡Anuncio actualizado correctamente!");
      router.push("/my-ads");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <header className="bg-white shadow-sm py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link href="/my-ads" className="text-blue-600 font-bold">← Volver a Mis Anuncios</Link>
          <span className="font-black text-gray-400">EDITAR ANUNCIO</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* 📸 Photos */}
            <section className="space-y-6">
               <h2 className="text-xl font-black text-blue-600">📸 Fotos ({images.length}/10)</h2>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map((url, index) => (
                    <div key={index} className="relative aspect-video group">
                      <img src={url} className="w-full h-full object-cover rounded-2xl border" alt="Preview" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round"/></svg>
                      </button>
                    </div>
                  ))}
                  {images.length < 10 && (
                    <div className="relative aspect-video border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 cursor-pointer">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{uploading ? "Subiendo..." : "Añadir foto"}</span>
                       <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading} />
                    </div>
                  )}
               </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-2">MARCA</label>
                <input required name="brand" value={formData.brand} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-2">MODELO</label>
                <input required name="model" value={formData.model} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-2">PRECIO (€)</label>
                <input required name="price" value={formData.price} onChange={handleChange} type="number" className="w-full px-6 py-4 rounded-2xl bg-blue-50 border-none outline-none focus:ring-2 focus:ring-blue-500 font-black text-blue-600 text-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-2">TELÉFONO</label>
                <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
              </div>
            </section>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 ml-2">DESCRIPCIÓN</label>
              <textarea required name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 font-medium"></textarea>
            </div>

            <button type="submit" disabled={saving || uploading} className="w-full py-6 rounded-[2rem] font-black text-2xl text-white bg-green-500 hover:bg-green-600 shadow-2xl transition-all active:scale-95">
              {saving ? "Guardando..." : "GUARDAR CAMBIOS"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
