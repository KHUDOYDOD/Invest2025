import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("investment_plans")
      .update({
        name: body.name,
        min_amount: body.minAmount,
        max_amount: body.maxAmount,
        daily_percent: body.dailyPercent,
        duration: body.duration,
        total_return: body.totalReturn,
        is_active: body.isActive,
        features: body.features,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating investment plan:", error)
      return NextResponse.json({ error: "Failed to update investment plan" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("investment_plans").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting investment plan:", error)
      return NextResponse.json({ error: "Failed to delete investment plan" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
