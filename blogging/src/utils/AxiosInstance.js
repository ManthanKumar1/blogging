import axios from "axios"

let AxiosInstance = axios.create({baseURL: 'http://localhost:3000'})

AxiosInstance.interceptors.request.use((req)=> {
    let stringifyBlogData = window.localStorage.getItem("blogData")

    if(stringifyBlogData){
        let blogData = JSON.parse(stringifyBlogData)
        let token = blogData.token

        req.headers.Authorization = `Bearer ${token}`
    }

    return req
})

export default AxiosInstance