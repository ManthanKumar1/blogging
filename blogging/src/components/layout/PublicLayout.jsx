import { Navigate, Outlet } from "react-router-dom"
import PublicNavbar from "../PublicNavbar"
import { UseAuth } from "../context/AuthContext"

let PublicLayout = () => {
    let auth = UseAuth()

    if(auth){
        return <Navigate to='/' />
    }

    return(
        <div>
            <PublicNavbar />
            <Outlet />
        </div>
    )
}

export default PublicLayout