import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    console.log("Loading testimonials from database...")

    // Получаем отзывы из базы данных
    const result = await query(`
      SELECT 
        id, name, role, text, rating, 
        investment_amount, profit_amount, 
        created_at, is_active
      FROM testimonials 
      WHERE is_active = true 
      ORDER BY created_at DESC
    `)

    const testimonials = result.rows.map(testimonial => ({
      id: testimonial.id,
      name: testimonial.name,
      role: testimonial.role,
      text: testimonial.text,
      rating: testimonial.rating,
      investment: testimonial.investment_amount,
      profit: testimonial.profit_amount,
      avatar: "/api/placeholder/40/40" // Placeholder avatar
    }))

    console.log(`✅ Loaded ${testimonials.length} testimonials from database`)

    return NextResponse.json({
      success: true,
      testimonials
    })
  } catch (error) {
    console.error("Error loading testimonials:", error)
    return NextResponse.json({
      success: false,
      testimonials: []
    })
  }
}