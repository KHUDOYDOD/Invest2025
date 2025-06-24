import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { status, admin_comment } = body

    const supabase = createClient()
    if (!supabase) {
      console.error("❌ Database connection failed")
      return NextResponse.json({ error: "Ошибка подключения к базе данных" }, { status: 500 })
    }

    console.log("🔄 Updating withdrawal request:", id, "Status:", status)

    // Получаем запрос на вывод
    const { data: withdrawalRequest, error: requestError } = await supabase
      .from("withdrawal_requests")
      .select("*")
      .eq("id", id)
      .single()

    if (requestError || !withdrawalRequest) {
      console.error("❌ Withdrawal request not found:", requestError)
      return NextResponse.json({ error: "Запрос на вывод не найден" }, { status: 404 })
    }

    // Обновляем статус запроса
    const { error: updateError } = await supabase
      .from("withdrawal_requests")
      .update({
        status,
        admin_comment,
        processed_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (updateError) {
      console.error("❌ Error updating withdrawal request:", updateError)
      return NextResponse.json({ error: "Ошибка обновления запроса" }, { status: 500 })
    }

    if (status === "approved") {
      // Обновляем статус транзакции
      await supabase
        .from("transactions")
        .update({ status: "completed" })
        .eq("user_id", withdrawalRequest.user_id)
        .eq("type", "withdrawal")
        .eq("amount", withdrawalRequest.amount)
        .eq("status", "pending")

      console.log("✅ Withdrawal approved")
    } else if (status === "rejected") {
      // Возвращаем средства пользователю
      const { error: balanceError } = await supabase.rpc("update_user_balance", {
        p_user_id: withdrawalRequest.user_id,
        p_amount: Number(withdrawalRequest.amount),
        p_operation: "add",
      })

      if (balanceError) {
        console.error("❌ Error returning balance:", balanceError)
        return NextResponse.json({ error: "Ошибка возврата средств" }, { status: 500 })
      }

      // Обновляем статус транзакции
      await supabase
        .from("transactions")
        .update({ status: "failed" })
        .eq("user_id", withdrawalRequest.user_id)
        .eq("type", "withdrawal")
        .eq("amount", withdrawalRequest.amount)
        .eq("status", "pending")

      console.log("✅ Withdrawal rejected and balance returned")
    }

    return NextResponse.json({
      success: true,
      message: `Запрос на вывод ${status === "approved" ? "одобрен" : "отклонен"}`,
    })
  } catch (error) {
    console.error("❌ Admin withdrawal request update error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
