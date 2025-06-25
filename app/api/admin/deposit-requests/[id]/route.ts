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
      [status === "approved" ? "completed" : "failed", id]
    )

    // Если запрос одобрен, зачисляем средства
    if (status === "approved") {
      await query(
        `UPDATE users SET balance = balance + $1 WHERE id = $2`,
        [depositRequest.amount, depositRequest.user_id]
      )

      console.log("✅ Deposit approved and balance updated")
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