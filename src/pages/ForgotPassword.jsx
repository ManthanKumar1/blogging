import { useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import axios from "../utils/AxiosInstance"

import sendCodeValidator from "../validators/SendCodeValidator"
import recoverPasswordValidator from "../validators/RecoverPasswordValidator"

let initialForm = { email: "", code: "", password: "" }
let initialFormError = { code: "", password: "" }
let url = '/recoverPassword'

let ForgotPassword = () => {
    let [formData, setFormData] = useState(initialForm)
    let [formError, setFormError] = useState(initialFormError)
    let [loading, setLoading] = useState(false)
    let [emailError, setEmailError] = useState("")
    let [hasEmail, setHasEmail] = useState(false)

    let navigate = useNavigate()

    let handleChange = (e) => {
        setFormData((previous) => ({ ...previous, [e.target.name]: e.target.value }))
    }

    let handleSendCode = async (e) => {
        e.preventDefault()

        let errors = sendCodeValidator({ email: formData.email })
        if (errors.email) {
            setEmailError(errors.email)
        } else {
            try {
                setLoading(true)

                // api request
                let body = { userEmail: formData.email }
                let response = await axios.post(`/sendForgotPassword`, body)
                // let data = response.data
                // console.log(data)
                toast.success(response?.data?.message || "Code send successful!")

                setHasEmail(true)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                const message = error?.response?.data?.message || "Something went wrong"
                toast.error(message)
            }
        }
    }

    let handleRecoverPassword = async (e) => {
        e.preventDefault()

        let errors = recoverPasswordValidator({ code: formData.code, password: formData.password })
        if (errors.code || errors.password) {
            setFormError(errors)
        } else {
            try {
                setLoading(true)

                // api request
                let body = { userEmail: formData.email, forgotPasswordCode: formData.code, userPassword: formData.password }
                let response = await axios.post(url, body)
                
                toast.success(response?.data?.message || "Signup successful!")

                setFormData(initialForm)
                setFormError(initialFormError)
                setLoading(false)
                navigate('/login')
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
            <form className="inner-container" onSubmit={!hasEmail ? handleSendCode : handleRecoverPassword}>
                <h2 className="form-title">
                    {!hasEmail ? "Recover Password" : "New Password"}
                </h2>

                {!hasEmail ? (<div className="form-group">
                    <label>Email</label>
                    <input className="form-control" type="email" name="email" placeholder="john@gmail.com" value={formData.email} onChange={handleChange} />
                    {formError.email && <p className="error">{formError.email}</p>}
                </div>) : (
                    <>
                        <div className="form-group">
                            <label>Code</label>
                            <input className="form-control" type="text" name="code" placeholder="Type code here" value={formData.code} onChange={handleChange} />
                            {formError.code && <p className="error">{formError.code}</p>}
                        </div>

                        <div className="form-group">
                            <label>New Password</label>
                            <input className="form-control" type="password" name="password" placeholder="**********" value={formData.password} onChange={handleChange} />
                            {formError.password && <p className="error">{formError.password}</p>}
                        </div>
                    </>
                )}

                <div className="form-group">
                    <input className="button" type="submit" value={loading ? "Sending..." : 'Send'} />
                </div>
            </form>
        </div>
    )
}

export default ForgotPassword