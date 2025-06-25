import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { status, admin_comment } = body

    console.log("🔄 Updating withdrawal request:", id, "Status:", status)

    // Получаем запрос на вывод
    const withdrawalResult = await query(
      `SELECT * FROM transactions WHERE id = $1 AND type = 'withdrawal'`,
      [id]
    )

    if (withdrawalResult.rows.length === 0) {
      console.error("❌ Withdrawal request not found")
      return NextResponse.json({ error: "Запрос на вывод не найден" }, { status: 404 })
    }

    const withdrawalRequest = withdrawalResult.rows[0]

    // Обновляем статус запроса
    await query(
      `UPDATE transactions SET status = $1, updated_at = NOW() WHERE id = $2`,
      [status === "approved" ? "completed" : "failed", id]
    )

    if (status === "approved") {
      console.log("✅ Withdrawal approved")
    } else if (status === "rejected") {
      // Возвращаем средства пользователю
      await query(
        `UPDATE users SET balance = balance + $1 WHERE id = $2`,
        [withdrawalRequest.amount, withdrawalRequest.user_id]
      )

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