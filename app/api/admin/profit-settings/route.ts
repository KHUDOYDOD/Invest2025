import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("profit_settings").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching profit settings:", error)
      return NextResponse.json({ error: "Failed to fetch profit settings" }, { status: 500 })
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
      .from("profit_settings")
      .insert([
        {
          plan_name: body.plan_name,
          min_amount: body.min_amount,
          max_amount: body.max_amount,
          daily_percent: body.daily_percent,
          duration_days: body.duration_days,
          payout_interval_hours: body.payout_interval_hours,
          is_active: body.is_active || true,
          description: body.description,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating profit setting:", error)
      return NextResponse.json({ error: "Failed to create profit setting" }, { status: 500 })
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
      .from("profit_settings")
      .update({
        plan_name: body.plan_name,
        min_amount: body.min_amount,
        max_amount: body.max_amount,
        daily_percent: body.daily_percent,
        duration_days: body.duration_days,
        payout_interval_hours: body.payout_interval_hours,
        is_active: body.is_active,
        description: body.description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating profit setting:", error)
      return NextResponse.json({ error: "Failed to update profit setting" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
