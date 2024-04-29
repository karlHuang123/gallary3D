import axios from 'axios'

const galleryAxios = axios.create({
  baseURL: '/gallery/api',
})

// galleryAxios.interceptors.request.use((config) => {
//   return config
// })

// galleryAxios.interceptors.response.use((res) => {
//   console.log(res.data)
//   return res
// })

export default galleryAxios
