import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import axios from '../../utils/AxiosInstance'
import addPostValidator from "../../validators/AddPostValidator"

let initialForm = { title: "", desc: "", category: "" }
let initialFormError = { title: "", category: "" }
let url = '/addPost'

let NewPost = () => {
    let [formData, setFormData] = useState(initialForm)
    let [formError, setFormError] = useState(initialFormError)
    let [loading, setLoading] = useState(false)
    let [category, setCategory] = useState([])
    let [extensionError, setExtensionError] = useState(null)
    let [fileId, setFileId] = useState(null)
    let [isDisable, setIsDisable] = useState(false)

    let navigate = useNavigate()

    useEffect(() => {
        let getCategory = async () => {
            try {
                let response = await axios.get(`/getAllCategory?size=1000`)

                setCategory(response.data.data)
            } catch (error) {
                const message = error?.response?.data?.message || "Something went wrong"
                toast.error(message)
            }
        }

        getCategory()
    }, [])

    let handleChange = (e) => {
        setFormData((previous) => ({ ...previous, [e.target.name]: e.target.value }))
    }

    let handleSubmit = async (e) => {
        e.preventDefault()

        let errors = addPostValidator({ title: formData.title, category: formData.category })
        if (errors.title || errors.category) {
            setFormError(errors)
        } else {
            try {
                setLoading(true)

                let input = formData

                // if(fileId){
                //     input = {...input, file: fileId}
                // }

                // api request
                // let body = { title: formData.title, desc: formData.desc,  }
                let response = await axios.post(url, input)

                toast.success(response?.data?.message || "Post Added Successfully!")

                setFormData(initialForm)
                setFormError(initialFormError)
                setLoading(false)
                navigate('/posts')
            } catch (error) {
                setLoading(false)
                const message = error?.response?.data?.message || "Something went wrong"
                toast.error(message)
            }
        }
    }

    let handleFile = async (e) => {
        console.log(e.target.files)

        let formInput = new FormData()
        formInput.append('image', e.target.files[0])

        let type = e.target.files[0].type

        if (type === 'image/png' || type === 'image/jpg' || type === 'image/jpeg') {
            setExtensionError(null)

            // try {
            // setIsDisable(true)
            //     // api request
            //     // let body = { title: formData.title, desc: formData.desc }
            //     let response = await axios.post('/uploadFile', formInput)
            // setFileId(data.data._id)
            //     toast.success(response?.data?.message || "Category Added Successfully!")
            // setIsDisable(false)
            // } catch (error) {
            // setIsDisable(false)
            //     const message = error?.response?.data?.message || "Something went wrong"
            //     toast.error(message)
            // }
        } else {
            setExtensionError("only .png, .jpg or .jpeg files allowed")
        }
    }

    return (
        <div>
            <button className="button button-block" onClick={() => navigate(-1)}>Back</button>
            <div className="form-container">
                <form className="inner-container" onSubmit={handleSubmit}>
                    <h2 className="form-title">New Post</h2>
                    <div className="form-group">
                        <label>Title</label>
                        <input className="form-control" type="text" name="title" placeholder="Type title here" value={formData.title} onChange={handleChange} />
                        {formError.title && <p className="error">{formError.title}</p>}
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <input className="form-control" type="text" name="desc" placeholder="Type description here" value={formData.desc} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Select an image</label>
                        <input className="form-control" type="file" name="file" placeholder="Upload Image" onChange={handleFile} />
                        {extensionError && <p className="error">{extensionError}</p>}
                    </div>

                    <div className="form-group">
                        <label>Select a category</label>
                        <select className="form-control" name="category" value={formData.category} onChange={handleChange}>
                            {category.map((category) => <option key={category._id} value={category._id}>{category.title}</option>)}
                        </select>
                        {formError.category && <p className="error">{formError.category}</p>}
                    </div>

                    <div className="form-group">
                        <input className="button" type="submit" disabled={isDisable} value={loading ? 'Adding....' : 'Add'} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NewPost