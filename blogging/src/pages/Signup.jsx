import { useState } from "react"
// import axios from 'axios'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import signupValidator from "../validators/SignupValidator"
import axios from "../utils/AxiosInstance"

let initialForm = { name: "", email: "", password: "", confirmPassword: "" }
let initialFormError = { name: "", email: "", password: "", confirmPassword: "" }
let url = '/signUp'

let SignUp = () => {
    let [formData, setFormData] = useState(initialForm)
    let [formError, setFormError] = useState(initialFormError)
    let [loading, setLoading] = useState(false)

    let navigate = useNavigate()

    let handleChange = (e) => {
        setFormData((previous) => ({ ...previous, [e.target.name]: e.target.value }))
    }

    let handleSubmit = async (e) => {
        e.preventDefault()

        let errors = signupValidator({ name: formData.name, email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword })
        if (errors.name || errors.email || errors.password || errors.confirmPassword) {
            setFormError(errors)
        } else {
            try {
                setLoading(true)

                // api request
                let body = { userName: formData.name, userEmail: formData.email, userPassword: formData.password }
                let response = await axios.post(url, body)
                // let data = response.data
                // console.log(data)
                toast.success(response?.data?.message || "Signup successful!")

                setFormData(initialForm)
                setFormError(initialFormError)
                setLoading(false)
                navigate('/login')
            } catch (error) {
                setLoading(false)
                // let response = error.response
                // let data = response.data
                // console.log(data)
                // toast.error(data.message, {
                //     position: toast.POSITION.TOP_RIGHT,
                //     autoClose: true
                // })
                const message = error?.response?.data?.message || "Something went wrong"
                toast.error(message)

                console.log(error.message)
            }
        }
    }
    
    return (
        <div className="form-container">
            <form className="inner-container" onSubmit={handleSubmit}>
                <h2 className="form-title">Signup</h2>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        className="form-control"
                        type="text"
                        name="name"
                        placeholder="John"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {formError.name && <p className="error">{formError.name}</p>}
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        className="form-control"
                        type="email"
                        name="email"
                        placeholder="John@gmail.com"
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
                    <label>Confirm Password</label>
                    <input
                        className="form-control"
                        type="password"
                        name="confirmPassword"
                        placeholder="**********"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    {formError.confirmPassword && <p className="error">{formError.confirmPassword}</p>}
                </div>

                <div className="form-group">
                    <input className="button" type="submit" value={loading ? 'Saving....' : 'Signup'} />
                </div>
            </form>
        </div>
    )
}

export default SignUp