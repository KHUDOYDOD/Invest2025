// Заглушка для совместимости со старым кодом
export function createClient() {
  return {
    auth: {
      signUp: async () => ({ error: new Error('Use /api/auth/register instead') }),
      signInWithPassword: async () => ({ error: new Error('Use /api/auth/login instead') }),
      signOut: async () => ({ error: new Error('Use /api/auth/logout instead') }),
      getUser: async () => ({ data: { user: null }, error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({ data: [], error: null }),
        data: [],
        error: null
      }),
      insert: () => ({ data: [], error: null }),
      update: () => ({ data: [], error: null }),
      delete: () => ({ data: [], error: null }),
    })
  }
}
