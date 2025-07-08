import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "./context/AuthContext";

let PrivateNavbar = () => {
    let navigate = useNavigate()
    let auth = UseAuth()

    let handleLogout = () => {
        window.localStorage.removeItem("blogData")
        toast.success("Logout successful!")

        navigate('/login')
    }
    return(
        <nav className="primary-link">
            <NavLink to="/">Home</NavLink>
            {(auth.role === 1 || auth.role ===2) && <NavLink to="category">Category</NavLink>}
            <NavLink to="posts">Posts</NavLink>
            <NavLink to="profile">Profile</NavLink>
            <NavLink to="setting">Setting</NavLink>
            <NavLink to="login" onClick={handleLogout}>Logout</NavLink>
        </nav>
    )
}

export default PrivateNavbar