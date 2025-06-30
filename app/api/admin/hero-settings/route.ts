
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("hero_settings")
      .select("*")
      .eq("id", "00000000-0000-0000-0000-000000000001")
      .single()

    if (error) {
      console.error("Error fetching hero settings:", error)
      return NextResponse.json({ error: "Failed to fetch hero settings" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("hero_settings")
      .update({
        enabled: body.enabled,
        title: body.title,
        subtitle: body.subtitle,
        badge_text: body.badgeText,
        button1_text: body.button1Text,
        button1_link: body.button1Link,
        button2_text: body.button2Text,
        button2_link: body.button2Link,
        show_buttons: body.showButtons,
        background_animation: body.backgroundAnimation,
        show_stats: body.showStats,
        stats_users: body.statsUsers,
        stats_users_label: body.statsUsersLabel,
        stats_invested: body.statsInvested,
        stats_invested_label: body.statsInvestedLabel,
        stats_return: body.statsReturn,
        stats_return_label: body.statsReturnLabel,
        stats_reliability: body.statsReliability,
        stats_reliability_label: body.statsReliabilityLabel,
        updated_at: new Date().toISOString(),
      })
      .eq("id", "00000000-0000-0000-0000-000000000001")
      .select()
      .single()

    if (error) {
      console.error("Error updating hero settings:", error)
      return NextResponse.json({ error: "Failed to update hero settings" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
