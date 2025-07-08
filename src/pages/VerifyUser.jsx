import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import axios from "../utils/AxiosInstance"
import { UseAuth } from "../components/context/AuthContext"

let url = '/verifyUser'

let VerifyUser = () => {
    let [loading, setLoading] = useState(false)
    let [code, setCode] = useState("")
    let [codeError, setCodeError] = useState("")
    let [loading1, setLoading1] = useState(false)

    let navigate = useNavigate()
    let auth = UseAuth()

    let handleSend = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            // api request
            let response = await axios.post(`/verifyCode`, { userEmail: auth.userEmail })

            toast.success(response?.data?.message || "Category Added Successfully!")

            setLoading(false)
        } catch (error) {
            setLoading(false)
            const message = error?.response?.data?.message || "Something went wrong"
            toast.error(message)
        }
    }

    let handleSubmit = async (e) => {
        e.preventDefault()

        if (code) {
            try {
                setLoading1(true)

                // api request
                let response = await axios.post(url, { userEmail: auth.userEmail, verificationCode: code })

                toast.success(response?.data?.message || "Category Added Successfully!")

                window.localStorage.removeItem("blogData")
                setCode("")
                setCodeError("")
                setLoading1(false)
                navigate('/login')
            } catch (error) {
                setLoading1(false)
                setCode("")
                setCodeError("")
                const message = error?.response?.data?.message || "Something went wrong"
                toast.error(message)
            }
        } else {
            setCodeError("Code is required")
        }
    }
    return (
        <div>
            <button className="button button-block" onClick={() => navigate(-1)}>Back</button>
            <br />
            <button className="button button-block" onClick={handleSend}>{loading ? "Sending..." : "Send Verification Code"}</button>

            <div className="form-container">
                <form className="inner-container" onSubmit={handleSubmit}>
                    <h2 className="form-title">Verify User</h2>
                    <div className="form-group">
                        <label>Confirmation Code</label>
                        <input className="form-control" type="text" name="code" placeholder="Type code here" value={code} onChange={(e) => { setCode(e.target.value) }} />
                        {codeError && <p className="error">{codeError}</p>}
                    </div>

                    <div className="form-group">
                        <input className="form-button" type="submit" value={loading ? "Verifing..." : 'Verify'} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default VerifyUser