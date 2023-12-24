import apiClient from '@/services/axios'

export async function database_connection (operation, host = null, username = null, password = null, port = null, database = null) {
  return apiClient
    .post('/db/database-connection', { operation, host, username, password, port, database })
    .then(response => response)
    .catch(err => console.error(err))
}

export async function database_create (operation, host = null, username = null, password = null, port = null, database = null) {
  return apiClient
    .post('/db/database-create', { operation, host, username, password, port, database })
    .then(response => response)
    .catch(err => console.error(err))
}

