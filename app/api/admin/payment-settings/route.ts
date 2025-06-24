import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("payment_settings")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching payment settings:", error)
      return NextResponse.json({ error: "Failed to fetch payment settings" }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("payment_settings")
      .insert([
        {
          method_name: body.method_name,
          method_type: body.method_type,
          wallet_address: body.wallet_address,
          qr_code_url: body.qr_code_url,
          instructions: body.instructions,
          min_amount: body.min_amount,
          max_amount: body.max_amount,
          fee_percent: body.fee_percent,
          is_active: body.is_active || true,
          display_order: body.display_order || 1,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating payment setting:", error)
      return NextResponse.json({ error: "Failed to create payment setting" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("payment_settings")
      .update({
        method_name: body.method_name,
        method_type: body.method_type,
        wallet_address: body.wallet_address,
        qr_code_url: body.qr_code_url,
        instructions: body.instructions,
        min_amount: body.min_amount,
        max_amount: body.max_amount,
        fee_percent: body.fee_percent,
        is_active: body.is_active,
        display_order: body.display_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating payment setting:", error)
      return NextResponse.json({ error: "Failed to update payment setting" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
