import axios from 'axios'

axios.interceptors.request.use((config) => {
  return config
})

axios.interceptors.response.use((response) => {
  if (response.status >= 200 && response.status < 300) {
    return response.data
  } else {
    return Promise.reject(response)
  }
})
