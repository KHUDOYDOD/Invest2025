import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Force dynamic rendering for this route
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("site_settings").select("*").single()

    if (error) {
      console.error("Error fetching site settings:", error)
      return NextResponse.json({ error: "Failed to fetch site settings" }, { status: 500 })
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
      .from("site_settings")
      .update({
        site_name: body.siteName,
        site_description: body.siteDescription,
        contact_email: body.contactEmail,
        registration_enabled: body.registrationEnabled,
        maintenance_mode: body.maintenanceMode,
        min_deposit: body.minDeposit,
        max_deposit: body.maxDeposit,
        min_withdraw: body.minWithdraw,
        withdraw_fee: body.withdrawFee,
        referral_bonus: body.referralBonus,
        welcome_bonus: body.welcomeBonus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", "00000000-0000-0000-0000-000000000001")
      .select()
      .single()

    if (error) {
      console.error("Error updating site settings:", error)
      return NextResponse.json({ error: "Failed to update site settings" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
