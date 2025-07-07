import { Navigate, Outlet } from "react-router-dom"
import PrivateNavbar from "../PrivateNavbar"
import { UseAuth } from "../context/AuthContext"

let PrivateLayout = () => {
    let auth = UseAuth()

    if(!auth){
        return <Navigate to='login' />
    }

    return(
        <div>
            <PrivateNavbar />
            <Outlet />
        </div>
    )
}

export default PrivateLayout