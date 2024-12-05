import axios from 'axios'

export const test = () => {
  axios.get('/api').then((res) => console.log(res))
  axios.get('/api/test').then((res) => console.log(res))
  axios
    .post('/api', {
      method: 'POST'
    })
    .then((Res) => console.log(Res))
  axios.get('/api/matting').then((Res) => console.log(Res))
}
