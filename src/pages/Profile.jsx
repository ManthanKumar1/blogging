import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import axios from "../utils/AxiosInstance"

import profileValidator from "../validators/ProfileValidator"

let initialForm = { name: "", email: "" }
let initialFormError = { name: "", email: "" }
let url = '/updateProfile'

let Profile = () => {
    let [formData, setFormData] = useState(initialForm)
    let [formError, setFormError] = useState(initialFormError)
    let [loading, setLoading] = useState(false)
    let [oldEmail, setOldEmail] = useState(null)

    let navigate = useNavigate()

    useEffect(() => {
        let getUser = async () => {
            try {
                let response = await axios.get(`/currentUser`)
                let data = response.data.data
                // console.log(data.userName)

                console.log({name: data.userName, email: data.userEmail})

                setFormData({name: data.userName, email: data.userEmail})
                setOldEmail(data.userEmail)
            } catch (error) {
                const message = error?.response?.data?.message || "Something went wrong"
                toast.error(message)
            }
        }

        getUser()
    }, [])

    let handleChange = (e) => {
        setFormData((previous) => ({ ...previous, [e.target.name]: e.target.value }))
    }

    let handleSubmit = async (e) => {
        e.preventDefault()

        let errors = profileValidator({ name: formData.name, email: formData.email })
        if (errors.name || errors.email) {
            setFormError(errors)
        } else {
            try {
                setLoading(true)

                // api request
                let body = { userName: formData.name, userEmail: formData.email }
                let response = await axios.put(url, body)

                toast.success(response?.data?.message || "Profile Updated successful!")

                setFormError(initialFormError)
                setLoading(false)

                if(oldEmail !== formData.email){
                    window.localStorage.removeItem("blogData")
                    navigate('/login')
                }
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
        <div>
            <button className="button button-block" onClick={() => navigate(-1)}>Back</button>

            <div className="form-container">
                <form className="inner-container" onSubmit={handleSubmit}>
                    <h2 className="form-title">Update Profile</h2>
                    <div className="form-group">
                        <label>Name</label>
                        <input className="form-control" type="text" name="name" placeholder="John" value={formData.name} onChange={handleChange} />
                        {formError.name && <p className="error">{formError.name}</p>}
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input className="form-control" type="email" name="email" placeholder="John" value={formData.email} onChange={handleChange} />
                        {formError.email && <p className="error">{formError.email}</p>}
                    </div>

                    <div className="form-group">
                        <input className="button" type="submit" value={loading ? 'Updating....' : 'Update'} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Profile