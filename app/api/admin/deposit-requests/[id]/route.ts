import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { status, admin_comment } = body

    console.log("🔄 Updating deposit request:", id, "Status:", status)

    const supabase = createClient()
    if (!supabase) {
      console.error("❌ Database connection failed")
      return NextResponse.json({ error: "Ошибка подключения к базе данных" }, { status: 500 })
    }

    // Получаем запрос на пополнение
    const { data: depositRequest, error: requestError } = await supabase
      .from("deposit_requests")
      .select("*")
      .eq("id", id)
      .single()

    if (requestError || !depositRequest) {
      console.error("❌ Deposit request not found:", requestError)
      return NextResponse.json({ error: "Запрос на пополнение не найден" }, { status: 404 })
    }

    // Обновляем статус запроса
    const { error: updateError } = await supabase
      .from("deposit_requests")
      .update({
        status,
        admin_comment,
        processed_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (updateError) {
      console.error("❌ Error updating deposit request:", updateError)
      return NextResponse.json({ error: "Ошибка обновления запроса" }, { status: 500 })
    }

    // Если запрос одобрен, зачисляем средства
    if (status === "approved") {
      const { error: balanceError } = await supabase.rpc("update_user_balance", {
        p_user_id: depositRequest.user_id,
        p_amount: Number(depositRequest.amount),
        p_operation: "add",
      })

      if (balanceError) {
        console.error("❌ Error updating user balance:", balanceError)
        return NextResponse.json({ error: "Ошибка зачисления средств" }, { status: 500 })
      }

      // Обновляем статус транзакции
      await supabase
        .from("transactions")
        .update({ status: "completed" })
        .eq("user_id", depositRequest.user_id)
        .eq("type", "deposit")
        .eq("amount", depositRequest.amount)
        .eq("status", "pending")

      console.log("✅ Deposit approved and balance updated")
    } else if (status === "rejected") {
      // Обновляем статус транзакции
      await supabase
        .from("transactions")
        .update({ status: "failed" })
        .eq("user_id", depositRequest.user_id)
        .eq("type", "deposit")
        .eq("amount", depositRequest.amount)
        .eq("status", "pending")

      console.log("✅ Deposit rejected")
    }

    return NextResponse.json({
      success: true,
      message: `Запрос на пополнение ${status === "approved" ? "одобрен" : "отклонен"}`,
    })
  } catch (error) {
    console.error("❌ Admin deposit request update error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { status, admin_comment } = body

    console.log("🔄 Updating deposit request:", id, "Status:", status)

    // Получаем запрос на пополнение
    const depositResult = await query(
      `SELECT * FROM transactions WHERE id = $1 AND type = 'deposit'`,
      [id]
    )

    if (depositResult.rows.length === 0) {
      console.error("❌ Deposit request not found")
      return NextResponse.json({ error: "Запрос на пополнение не найден" }, { status: 404 })
    }

    const depositRequest = depositResult.rows[0]

    // Обновляем статус запроса
    await query(
      `UPDATE transactions SET status = $1, updated_at = NOW() WHERE id = $2`,
      [status, id]
    )

    // Если запрос одобрен, зачисляем средства
    if (status === "completed") {
      await query(
        `UPDATE users SET balance = balance + $1 WHERE id = $2`,
        [depositRequest.amount, depositRequest.user_id]
      )

      console.log("✅ Deposit approved and balance updated")
    }

    return NextResponse.json({
      success: true,
      message: `Запрос на пополнение ${status === "completed" ? "одобрен" : "отклонен"}`,
    })
  } catch (error) {
    console.error("❌ Admin deposit request update error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
