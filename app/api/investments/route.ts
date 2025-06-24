import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Получаем текущего пользователя
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("investments")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Error fetching investments:", error)
      return NextResponse.json({ error: "Ошибка загрузки инвестиций" }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("❌ Investments API error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { plan_id, amount } = body

    console.log("📈 Creating investment:", { plan_id, amount })

    if (!plan_id || !amount) {
      return NextResponse.json({ error: "Не все обязательные поля заполнены" }, { status: 400 })
    }

    const supabase = createClient()

    // Получаем текущего пользователя
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
    }

    const userId = session.user.id

    // Получаем план инвестирования
    const { data: plan, error: planError } = await supabase
      .from("investment_plans")
      .select("*")
      .eq("id", plan_id)
      .single()

    if (planError || !plan) {
      return NextResponse.json({ error: "План инвестирования не найден" }, { status: 404 })
    }

    // Проверяем баланс пользователя
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("balance")
      .eq("user_id", userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Ошибка получения баланса" }, { status: 500 })
    }

    if (Number(profile.balance) < Number(amount)) {
      return NextResponse.json({ error: "Недостаточно средств на балансе" }, { status: 400 })
    }

    // Создаем инвестицию
    const { data: investment, error: investmentError } = await supabase
      .from("investments")
      .insert([
        {
          user_id: userId,
          plan_id,
          amount: Number(amount),
          status: "active",
          profit_earned: 0,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + plan.duration_days * 24 * 60 * 60 * 1000).toISOString(),
        },
      ])
      .select()
      .single()

    if (investmentError) {
      console.error("❌ Error creating investment:", investmentError)
      return NextResponse.json({ error: "Ошибка создания инвестиции" }, { status: 500 })
    }

    // Обновляем баланс пользователя
    const newBalance = Number(profile.balance) - Number(amount)
    const { error: balanceError } = await supabase
      .from("user_profiles")
      .update({ balance: newBalance })
      .eq("user_id", userId)

    if (balanceError) {
      console.error("❌ Error updating balance:", balanceError)
    }

    // Создаем транзакцию в истории
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: userId,
          type: "investment",
          amount: Number(amount),
          status: "completed",
          description: `Инвестиция в план "${plan.name}"`,
          method: "balance",
        },
      ])
      .select()
      .single()

    if (transactionError) {
      console.error("❌ Error creating transaction:", transactionError)
      // Не возвращаем ошибку, так как инвестиция уже создана
    }

    console.log("✅ Investment created:", investment.id)
    console.log("✅ Transaction created:", transaction?.id)
    console.log("✅ Balance updated:", newBalance)

    return NextResponse.json({
      success: true,
      message: "Инвестиция успешно создана",
      data: investment,
      newBalance,
    })
  } catch (error) {
    console.error("❌ Investment creation error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
