import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Force dynamic rendering for this route
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const avatar = formData.get("avatar") as File
    const email = formData.get("email") as string

    if (!avatar || !email) {
      return NextResponse.json({ error: "Avatar and email are required" }, { status: 400 })
    }

    const supabase = createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Загружаем файл в Supabase Storage
    const fileExt = avatar.name.split(".").pop()
    const fileName = `${email.replace("@", "_at_")}_${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // Преобразуем File в ArrayBuffer для загрузки
    const arrayBuffer = await avatar.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Загружаем файл в storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from("user_files")
      .upload(filePath, buffer, {
        contentType: avatar.type,
        upsert: true,
      })

    if (storageError) {
      console.error("Error uploading avatar:", storageError)
      return NextResponse.json({ error: "Failed to upload avatar" }, { status: 500 })
    }

    // Получаем публичный URL файла
    const { data: publicUrlData } = supabase.storage.from("user_files").getPublicUrl(filePath)

    // Обновляем профиль пользователя с новым аватаром
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ avatar: publicUrlData.publicUrl, updated_at: new Date().toISOString() })
      .eq("email", email)

    if (updateError) {
      console.error("Error updating profile with avatar:", updateError)
      return NextResponse.json({ error: "Failed to update profile with avatar" }, { status: 500 })
    }

    return NextResponse.json({ avatarUrl: publicUrlData.publicUrl })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
