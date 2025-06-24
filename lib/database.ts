import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export { pool as db }

export async function query(text: string, params?: any[]) {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  console.log('Executed query', { text, duration, rows: res.rowCount })
  return res
}

export async function getClient() {
  const client = await pool.connect()
  const query = client.query
  const release = client.release
  
  // Monkey patch the query method to keep track of the last query executed
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!')
    console.error(`The last executed query on this client was: ${(client as any).lastQuery}`)
  }, 5000)
  
  client.query = (...args: any[]) => {
    ;(client as any).lastQuery = args
    return query.apply(client, args)
  }
  
  client.release = () => {
    clearTimeout(timeout)
    // Reset the original methods
    client.query = query
    client.release = release
    return release.apply(client)
  }
  
  return client
}