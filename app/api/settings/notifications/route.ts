import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Force dynamic rendering for this route
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("notification_settings").select("*").single()

    if (error) {
      console.error("Error fetching notification settings:", error)
      return NextResponse.json({ error: "Failed to fetch notification settings" }, { status: 500 })
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
      .from("notification_settings")
      .update({
        email_notifications: body.emailNotifications,
        sms_notifications: body.smsNotifications,
        push_notifications: body.pushNotifications,
        deposit_notifications: body.depositNotifications,
        withdraw_notifications: body.withdrawNotifications,
        investment_notifications: body.investmentNotifications,
        updated_at: new Date().toISOString(),
      })
      .eq("id", "00000000-0000-0000-0000-000000000001")
      .select()
      .single()

    if (error) {
      console.error("Error updating notification settings:", error)
      return NextResponse.json({ error: "Failed to update notification settings" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
