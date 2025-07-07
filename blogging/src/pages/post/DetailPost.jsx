import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import axios from '../../utils/AxiosInstance'
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { Modal, Button } from "react-bootstrap"

import placeImg from '../../assets/images/place.jpg'

import moment from "moment"

let url = '/getPost'

let PostDetail = () => {
    let [post, setPost] = useState(null)
    let [fileUrl, setFileUrl] = useState(null)
    let [showModal, setShowModal] = useState(false)

    let navigate = useNavigate()
    // let params = useParams()
    // let postId = params.id
    // console.log(postId)

    let location = useLocation()
    let searchParams = new URLSearchParams(location.search)
    let postId = searchParams.get('id')

    useEffect(() => {
        if (postId) {
            let getPost = async () => {
                try {
                    let response = await axios.get(`getPost?id=${postId}`)
                    let data = response.data.data

                    // toast.success(response?.data?.message || "Category Added Successfully!")

                    setPost(data)
                } catch (error) {
                    // const message = error?.response?.data?.message || "Something went wrong"
                    // toast.error(message)
                }
            }

            getPost()
        }
    }, [postId])

    useEffect(() => {
        if (post && post?.file) {
            let getFile = async () => {
                try {
                    let response = await axios.get(`/fetchFile?key=${post.file.key}`)
                    let data = response.data.data

                    // toast.success(response?.data?.message || "Category Added Successfully!")

                    setFileUrl(data.url)
                } catch (error) {
                    // const message = error?.response?.data?.message || "Something went wrong"
                    // toast.error(message)
                }
            }
            getFile()
        }
    }, [post])

    let handleDelete = async () => {
        try {
            let response = await axios.delete(`/deletePost?id=${postId}`)
            setShowModal(false)
            toast.success(response?.data?.message || "Category Deleted Successfully!")

            navigate('/posts')
        } catch (error) {
            setShowModal(false)
            const message = error?.response?.data?.message || "Something went wrong"
            toast.error(message)
        }
    }

    return (
        <div>
            <button className="button button-block" onClick={() => navigate(-1)}>Back</button>
            <br />
            <button className="button button-block" onClick={() => navigate(`/posts/update-post?postId=${postId}`)}>Update Post</button>
            <br />
            <button className="button button-block" onClick={()=> setShowModal(true)}>Delete Post</button>
            <div className="detail-container">
                <h2 className="post-title">{post?.title}</h2>
                <h5 className="post-category">Category: {post?.category?.title}</h5>
                <h5 className="post-category">Created At: {moment(post?.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</h5>
                <h5 className="post-category">Updated At: {moment(post?.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</h5>
                <p className="post-desc">
                    {post?.desc}
                </p>

                <img src={placeImg} alt="mern" />
                {/* <img src={fileUrl} alt="mern" /> */}
            </div>

            <Modal show={showModal} onHide={() => {
                setShowModal(false)
            }}>

                <Modal.Header closeButton>
                    <Modal.Title>Are you sure you want to delete this category?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <div style={{ margin: '0 auto' }}>
                        <Button className="no-button" onClick={() => {
                            setShowModal(false)
                        }}>No</Button>
                        <Button className="yes-button" onClick={handleDelete}>Yes</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PostDetail