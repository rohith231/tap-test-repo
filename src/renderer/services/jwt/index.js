import apiClient from '@/services/axios'
import { encryptStorage } from '@/utils'

export async function login (username, password) {
  return apiClient
    .post('/auth/login', {
      username,
      password,
    })
    .then(response => {
      if (response) {
        const accessToken = response.data.result.token
        if (accessToken) {
          encryptStorage.setItem('accessToken', accessToken)
        }
        return response.data
      }
      return false
    })
    .catch(err => console.error(err))
}


export async function currentAccount () {
  const accessToken = encryptStorage.getItem('accessToken')
  if (!accessToken) return
  return apiClient
    .get('/auth/account')
    .then(response => {
      if (response) {
        const accessToken = response.data.result.token
        if (accessToken) {
          encryptStorage.setItem('accessToken', accessToken)
        }
        return response.data
      }
      return false
    })
    .catch(err => console.error(err))
}

export async function logout () {
  return apiClient
    .get('/auth/logout')
    .then(() => {
      encryptStorage.removeItem('accessToken')
      return true
    })
    .catch(err => console.error(err))
}
