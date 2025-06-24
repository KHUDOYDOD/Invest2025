// Функция для проверки статуса запуска проекта
export async function isProjectLaunched(): Promise<boolean> {
  return true // Проект всегда запущен
}

// Функция для получения времени до запуска ближайшего проекта
export async function getTimeUntilLaunch() {
  return null // Нет предстоящих запусков
}

// Функция для получения всех активных запусков
export async function getActiveLaunches() {
  try {
    const response = await fetch('/api/admin/project-launches')
    if (!response.ok) return []
    const data = await response.json()
    return data.launches || []
  } catch (error) {
    console.error("Error getting active launches:", error)
    return []
  }
}
