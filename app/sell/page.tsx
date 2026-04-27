'use client';

import { useState, useEffect } from "react";
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

export default function SellPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

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

  // التحقق من تسجيل الدخول
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        setCheckingAuth(false);
      }
    }
    checkUser();
  }, [router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) { alert("Sube al menos una foto."); return; }
    setLoading(true);
    const { error } = await supabase.from('cars').insert([{ ...formData, images, user_id: user.id }]);
    if (error) { alert("Error: " + error.message); setLoading(false); }
    else { setLoading(false); setSubmitted(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };

  if (checkingAuth) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-center font-sans">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-3xl font-black mb-2">¡Hecho!</h1>
          <p className="text-gray-500 mb-8">Tu anuncio ha sido publicado correctamente.</p>
          <Link href="/" className="block w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-blue-600">CochesEspaña</Link>
          <button onClick={() => supabase.auth.signOut().then(() => router.push("/"))} className="text-sm font-bold text-red-500">Cerrar sesión</button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-4xl font-black mb-10 text-gray-900 tracking-tight text-center">Publicar anuncio</h1>
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* نفس الحقول السابقة */}
            <section className="space-y-6">
               <h2 className="text-xl font-black text-blue-600 flex items-center gap-2">📸 Fotos del coche ({images.length})</h2>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map((url, index) => (
                    <div key={index} className="relative aspect-video">
                      <img src={url} className="w-full h-full object-cover rounded-2xl border" alt="Preview" />
                    </div>
                  ))}
                  {images.length < 10 && (
                    <div className="relative aspect-video border-2 border-dashed rounded-2xl flex flex-col items-center justify-center bg-gray-50 cursor-pointer">
                       <span className="text-xs font-bold text-gray-400">{uploading ? "Subiendo..." : "Añadir foto"}</span>
                       <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  )}
               </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input required name="brand" value={formData.brand} onChange={handleChange} placeholder="Marca" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
              <input required name="model" value={formData.model} onChange={handleChange} placeholder="Modelo" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
              <input required name="year" value={formData.year} onChange={handleChange} type="number" placeholder="Año" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
              <input required name="price" value={formData.price} onChange={handleChange} type="number" placeholder="Precio (€)" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-blue-500 font-black text-blue-600" />
            </section>

            <button type="submit" disabled={loading || uploading} className="w-full py-5 rounded-[2rem] font-black text-xl text-white bg-blue-600 hover:bg-blue-700 shadow-2xl transition-all">
              {loading ? "Publicando..." : "Publicar Anuncio"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
