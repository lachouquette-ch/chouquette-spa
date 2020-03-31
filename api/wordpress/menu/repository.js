import axios from 'axios'

export default axios.create({
  baseURL: `${process.env.wpBaseUrl}/wp-json/menus/v1`
})
