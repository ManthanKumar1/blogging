import { Navigate, Outlet } from "react-router-dom"
import PrivateNavbar from "../PrivateNavbar"

let PrivateLayout = () => {
    let auth = false

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