import { createClient } from "@/lib/supabase/client"

// Функция для проверки статуса запуска проекта
export async function isProjectLaunched(): Promise<boolean> {
  try {
    const supabase = createClient()

    // If Supabase client couldn't be created, assume project is launched
    if (!supabase) {
      console.log("Supabase client not available, assuming project is launched")
      return true
    }

    // Получаем активные запуски проектов
    const { data: launches, error } = await supabase
      .from("project_launches")
      .select("*")
      .eq("is_active", true)
      .eq("show_on_site", true)
      .order("position", { ascending: true })

    if (error) {
      // If the error is because the table doesn't exist, assume project is launched
      if (error.message?.includes("does not exist")) {
        console.log("project_launches table does not exist, assuming project is launched")
        return true
      }

      console.error("Error checking project status:", error)
      return true // Default to showing the project if there's an error
    }

    if (!launches || launches.length === 0) {
      return true // Если нет счетчиков, считаем что проект запущен
    }

    // Проверяем, есть ли хотя бы один запущенный проект
    const now = new Date()
    const hasLaunchedProject = launches.some((launch) => {
      return launch.is_launched || new Date(launch.launch_date) <= now
    })

    return hasLaunchedProject
  } catch (error) {
    console.error("Error checking project status:", error)
    return true // Default to showing the project if there's an error
  }
}

// Функция для получения времени до запуска ближайшего проекта
export async function getTimeUntilLaunch() {
  try {
    const supabase = createClient()

    // If Supabase client couldn't be created, return null
    if (!supabase) {
      console.log("Supabase client not available, cannot get time until launch")
      return null
    }

    const { data: launches, error } = await supabase
      .from("project_launches")
      .select("*")
      .eq("is_active", true)
      .eq("show_on_site", true)
      .eq("is_launched", false)
      .order("launch_date", { ascending: true })
      .limit(1)

    if (error) {
      // If the error is because the table doesn't exist, return null
      if (error.message?.includes("does not exist")) {
        console.log("project_launches table does not exist, cannot get time until launch")
        return null
      }

      console.error("Error getting time until launch:", error)
      return null
    }

    if (!launches || launches.length === 0) {
      return null
    }

    const nextLaunch = launches[0]
    const now = new Date()
    const launchDate = new Date(nextLaunch.launch_date)
    const difference = launchDate.getTime() - now.getTime()

    if (difference <= 0) {
      return null
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      launchInfo: nextLaunch,
    }
  } catch (error) {
    console.error("Error getting time until launch:", error)
    return null
  }
}

// Функция для получения всех активных запусков
export async function getActiveLaunches() {
  try {
    const supabase = createClient()

    // If Supabase client couldn't be created, return empty array
    if (!supabase) {
      console.log("Supabase client not available, cannot get active launches")
      return []
    }

    const { data: launches, error } = await supabase
      .from("project_launches")
      .select("*")
      .eq("is_active", true)
      .eq("show_on_site", true)
      .order("position", { ascending: true })

    if (error) {
      // If the error is because the table doesn't exist, return empty array
      if (error.message?.includes("does not exist")) {
        console.log("project_launches table does not exist, cannot get active launches")
        return []
      }

      console.error("Error getting active launches:", error)
      return []
    }

    return launches || []
  } catch (error) {
    console.error("Error getting active launches:", error)
    return []
  }
}
