import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://coches-espana.vercel.app' // تأكد أن هذا هو رابط موقعك الفعلي

  // 1. الصفحات الثابتة
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/sell`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // 2. جلب جميع السيارات من قاعدة البيانات لإضافتها للـ Sitemap
  const { data: cars } = await supabase
    .from('cars')
    .select('id, updated_at')
    .order('created_at', { ascending: false })

  const carPages: MetadataRoute.Sitemap = (cars || []).map((car) => ({
    url: `${baseUrl}/cars/${car.id}`,
    lastModified: new Date(car.updated_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticPages, ...carPages]
}
