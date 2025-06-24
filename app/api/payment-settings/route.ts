import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("payment_settings")
      .select("*")
      .eq("is_active", true)
      .order("method_type", { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching payment settings:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch payment settings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { data, error } = await supabase.from("payment_settings").insert(body).select().single()

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error creating payment setting:", error)
    return NextResponse.json({ success: false, error: "Failed to create payment setting" }, { status: 500 })
  }
}
