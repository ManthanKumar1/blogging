import axios from "axios"

let AxiosInstance = axios.create({baseURL: 'http://localhost:3000'})

export default AxiosInstance