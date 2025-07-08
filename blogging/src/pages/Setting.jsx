import { useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import axios from "../utils/AxiosInstance"
import { UseAuth } from "../components/context/AuthContext"

import passwordValidator from "../validators/PasswordValidator"

let initialForm = { oldPassword: "", newPassword: "" }
let initialFormError = { oldPassword: "", newPassword: "" }
let url = '/changePassword'

let Setting = () => {
    let [formData, setFormData] = useState(initialForm)
    let [formError, setFormError] = useState(initialFormError)
    let [loading, setLoading] = useState(false)

    let navigate = useNavigate()

    let auth = UseAuth()

    let handleChange = (e) => {
        setFormData((previous) => ({ ...previous, [e.target.name]: e.target.value }))
    }

    let handleSubmit = async (e) => {
        e.preventDefault()

        let errors = passwordValidator({ oldPassword: formData.oldPassword, newPassword: formData.newPassword })
        if (errors.oldPassword || errors.newPassword) {
            setFormError(errors)
        } else {
            try {
                setLoading(true)

                // api request
                let response = await axios.put(url, formData)
                
                toast.success(response?.data?.message || "Password change successful!")

                setFormData(initialForm)
                setFormError(initialFormError)
                setLoading(false)
                navigate('/')
            } catch (error) {
                setLoading(false)
                
                const message = error?.response?.data?.message || "Something went wrong"
                toast.error(message)
            }
        }
    }

    return (
        <div>
            <button className="button button-block" onClick={()=> navigate(-1)}>Back</button>
            <br />
            {!auth.isVerified && <button className="button button-block" onClick={()=> navigate('/verify-user')}>Verify User</button>}

            <div className="form-container">
                <form className="inner-container" onSubmit={handleSubmit}>
                    <h2 className="form-title">Change Password</h2>

                    <div className="form-group">
                        <label>Old Password</label>
                        <input
                            className="form-control"
                            type="password"
                            name="oldPassword"
                            placeholder="**********"
                            value={formData.oldPassword}
                            onChange={handleChange}
                        />
                        {formError.oldPassword && <p className="error">{formError.oldPassword}</p>}
                    </div>

                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            className="form-control"
                            type="password"
                            name="newPassword"
                            placeholder="**********"
                            value={formData.newPassword}
                            onChange={handleChange}
                        />
                        {formError.newPassword && <p className="error">{formError.newPassword}</p>}
                    </div>

                    <div className="form-group">
                        <input className="button" type="submit" value={loading ? 'Changing...' : 'Change'} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Setting