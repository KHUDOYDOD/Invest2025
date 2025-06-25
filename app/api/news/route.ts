import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    console.log("Loading news from database...")

    // Получаем новости из базы данных
    const result = await query(`
      SELECT 
        id, title, excerpt, content, image_url, 
        category, created_at, is_published
      FROM news 
      WHERE is_published = true 
      ORDER BY created_at DESC
      LIMIT 6
    `)

    const news = result.rows.map(newsItem => ({
      id: newsItem.id,
      title: newsItem.title,
      excerpt: newsItem.excerpt,
      image: newsItem.image_url || "/api/placeholder/400/250",
      date: newsItem.created_at,
      category: newsItem.category || "Новости",
      readTime: "3 мин" // Можно вычислить на основе content
    }))

    console.log(`✅ Loaded ${news.length} news items from database`)

    return NextResponse.json({
      success: true,
      news
    })
  } catch (error) {
    console.error("Error loading news:", error)
    return NextResponse.json({
      success: false,
      news: []
    })
  }
}