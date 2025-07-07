import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export let AuthContext = createContext(null)

export let AuthProvider = ({ children }) => {
    let [auth, setAuth] = useState(null)

    let navigate = useNavigate()
    let location = useLocation()

    useEffect(() => {
        let stringifyBlogData = window.localStorage.getItem('blogData')

        if (stringifyBlogData) {
            let blogData = JSON.parse(stringifyBlogData)
            let user = blogData.user
            setAuth(user)
        } else {
            setAuth(null)
        }
    }, [navigate, location])

    return (<AuthContext.Provider value={auth}>{children}</AuthContext.Provider>)
}

export let UseAuth = () => {
    let auth = useContext(AuthContext)
    return auth
}