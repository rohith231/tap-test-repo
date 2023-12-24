import axios from 'axios'
import { encryptStorage, decryptWithAES } from '@/utils'
import {
  notification
} from 'ant-design-vue'
import NProgress from 'nprogress'
import router from "@/router";
import store from '@/store'


NProgress.configure({
  easing: 'ease',
  speed: 1000,
  showSpinner: false
});


const apiClient = axios.create({
  baseURL: 'http://localhost:3331/api/v1',
  customErrorMsg: false
})

apiClient.interceptors.request.use(request => {
  store.state.user.fetchLoading = true
  NProgress.start()
  const accessToken = encryptStorage.getItem('accessToken')
  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`
    request.headers.AccessToken = accessToken
  }
  return request

})


apiClient.interceptors.response.use((response) => {
  store.state.user.fetchLoading = false


  if (apiClient.defaults.customErrorMsg) {
    notification.error({
      message: "response.data.message",
      description: "response.data.result",
    })
  }

  NProgress.done()

  response.data = decryptWithAES(response.data)
  if ([400, 401].includes(response.data.statusCode)) {

    notification.error({
      message: response.data.message,
      description: response.data.result,
    })

    if (response.data.statusCode === 401) {
      router.push({
        path: '/auth/login',
        query: {},
      })
    }
  }

  // if (response.data.statusCode === 500) {
  //   notification.error({
  //     message: 'System Error',
  //     description: 'Please try again later',
  //   })
  // }

  return response;
}, (error) => {
  store.state.user.fetchLoading = false


  if (error.response && error.response.data) {
    return Promise.reject(error.response.data);
  }
  return Promise.reject(error.message);
});


export default apiClient
