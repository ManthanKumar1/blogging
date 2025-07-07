import { useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import axios from "../utils/AxiosInstance"

import loginValidator from "../validators/LoginValidator"

let initialForm = { email: "", password: "" }
let initialFormError = { email: "", password: "" }
let url = '/signIn'

let Login = () => {
    let [formData, setFormData] = useState(initialForm)
    let [formError, setFormError] = useState(initialFormError)
    let [loading, setLoading] = useState(false)

    let navigate = useNavigate()

    let handleChange = (e) => {
        setFormData((previous) => ({ ...previous, [e.target.name]: e.target.value }))
    }

    let handleSubmit = async (e) => {
        e.preventDefault()

        let errors = loginValidator({ email: formData.email, password: formData.password })
        if (errors.email || errors.password) {
            setFormError(errors)
        } else {
            try {
                setLoading(true)

                // api request
                let body = { userEmail: formData.email, userPassword: formData.password }
                let response = await axios.post(url, body)

                window.localStorage.setItem("blogData", JSON.stringify(response.data.data))

                toast.success(response?.data?.message || "Login successful!")

                setFormData(initialForm)
                setFormError(initialFormError)
                setLoading(false)
                navigate('/')
            } catch (error) {
                setLoading(false)
                const message = error?.response?.data?.message || "Something went wrong"
                toast.error(message)

                console.log(error.message)
            }
        }
    }

    return (
        <div className="form-container">
            <form className="inner-container" onSubmit={handleSubmit}>
                <h2 className="form-title">Login</h2>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        className="form-control"
                        type="email"
                        name="email"
                        placeholder="john@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {formError.email && <p className="error">{formError.email}</p>}
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        className="form-control"
                        type="password"
                        name="password"
                        placeholder="**********"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {formError.password && <p className="error">{formError.password}</p>}
                </div>

                <div className="form-group">
                    <input className="button" type="submit" value={loading ? 'Saving....' : 'Login'} />
                </div>
            </form>
        </div>
    )
}

export default Login