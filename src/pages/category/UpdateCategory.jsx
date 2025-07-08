import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import axios from '../../utils/AxiosInstance'
import { useNavigate, useParams, useLocation } from "react-router-dom"
import addCategoryValidator from '../../validators/AddCategoryValidator'

let initialForm = { title: "", desc: "" }
let initialFormError = { title: "" }
let url = '/updateCategory'

let UpdateCategory = () => {
    let [formData, setFormData] = useState(initialForm)
    let [formError, setFormError] = useState(initialFormError)
    let [loading, setLoading] = useState(false)

    let navigate = useNavigate()
    // let params = useParams()
    // let categoryId = params.categoryId
    // console.log(categoryId)

    let location = useLocation()
    let searchParams = new URLSearchParams(location.search)
    let categoryId = searchParams.get('categoryId')
    console.log(categoryId)

    useEffect(() => {
        if (categoryId) {
            let getCategory = async () => {
                try {
                    let response = await axios.get(`getCategory?id=${categoryId}`)
                    let data = response.data.data

                    // toast.success(response?.data?.message || "Category Added Successfully!")

                    setFormData({title: data.title, desc: data.desc})
                } catch (error) {
                    // const message = error?.response?.data?.message || "Something went wrong"
                    // toast.error(message)
                }
            }

            getCategory()
        }
    }, [categoryId])

    let handleChange = (e) => {
        setFormData((previous) => ({ ...previous, [e.target.name]: e.target.value }))
    }

    let handleSubmit = async (e) => {
        e.preventDefault()

        let errors = addCategoryValidator({ title: formData.title })
        if (errors.title) {
            setFormError(errors)
        } else {
            try {
                setLoading(true)

                // api request
                // let body = { title: formData.title, desc: formData.desc }
                let response = await axios.put(`${url}?categoryId=${categoryId}`, formData)

                toast.success(response?.data?.message || "Category Updated Successfully!")

                setFormData(initialForm)
                setFormError(initialFormError)
                setLoading(false)
                navigate('/category')
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
                    <h2 className="form-title">Update Category</h2>
                    <div className="form-group">
                        <label>Title</label>
                        <input className="form-control" type="text" name="title" placeholder="Type Title Here" value={formData.title} onChange={handleChange} />
                        {formError.title && <p className="error">{formError.title}</p>}
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" name="desc" placeholder="Type Description Here" value={formData.desc} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <input className="button" type="submit" value={loading ? 'Updating....' : 'Update'} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateCategory