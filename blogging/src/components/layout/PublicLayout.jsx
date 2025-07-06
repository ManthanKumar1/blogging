import { Navigate, Outlet } from "react-router-dom"
import PublicNavbar from "../PublicNavbar"

let PublicLayout = () => {
    let auth = false

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