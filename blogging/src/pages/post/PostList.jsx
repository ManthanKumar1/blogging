import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from 'react-router-dom'
import placeImg from '../../assets/images/place.jpg'
import axios from "../../utils/AxiosInstance"

let url = '/postList'

let PostList = () => {
    let [loading, setLoading] = useState(false)
    let [totalPage, setTotalPage] = useState(1)
    let [currentPage, setCurrentPage] = useState(1)
    let [pageCount, setPageCount] = useState([])
    let [searchValue, setSearchValue] = useState("")
    let [posts, setPosts] = useState([])

    let navigate = useNavigate()

    useEffect(() => {
        let getPost = async () => {
            try {
                setLoading(true)
                let response = await axios.get(`${url}?page=${currentPage}&search=${searchValue}`)

                setPosts(response.data.data)
                setTotalPage(response.data.pages)

                // toast.success(response?.data?.message || "Category Added Successfully!")

                setFormData(initialForm)
                setFormError(initialFormError)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                // const message = error?.response?.data?.message || "Something went wrong"
                // toast.error(message)
            }
        }

        getPost()
    }, [currentPage])

    useEffect(() => {
        if (totalPage > 1) {
            let tempPageCount = []
            for (let i = 1; i <= totalPage; i++) {
                tempPageCount = [...tempPageCount, i]
            }
            setPageCount(tempPageCount)
        } else {
            setPageCount([])
        }
    }, [totalPage])

    let handlePrev = () => {
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
    }

    let handleNext = () => {
        setCurrentPage((prev) => (prev < totalPage ? prev + 1 : prev))
    }

    let handlePage = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    let handleSearch = async (e) => {
        let input = e.target.value
        setSearchValue(input)
        let response = await axios.get(`${url}?q=${input}&page=${currentPage}`)
        let data = response.data

        setPosts(data.data)
        setTotalPage(data.pages)
    }

    return (
        <div>
            <button className='button button-block' onClick={() => navigate('add-post')}>Add New Post</button>
            <h2 className='table-title'>Post List</h2>

            <input className='search-input' type='text' name='search' placeholder='Search Here' onChange={handleSearch} />

            <div className='flexbox-container wrap'>
                {loading ? "Loading..." : posts.map((post) => (
                    <div className='post-card' key={post._id} onClick={() => navigate(`detail-post?id=${post._id}`)}>
                        <h4 className='card-title'>{post.title}</h4>
                        <p className='card-desc'>
                            {post.desc.substring(0, 50)}
                        </p>
                        <img src={placeImg} alt='mern' className='card-img' />
                    </div>
                ))}
            </div>

            {pageCount.length > 0 &&
                <div className="pag-container">
                    <button className="pag-button" onClick={handlePrev} disabled={currentPage === 1}>
                        Prev
                    </button>
                    {pageCount.map((pageNumber, index) => (
                        <button
                            key={index}
                            className={`pag-button`}
                            onClick={() => handlePage(pageNumber)}
                            style={{ backgroundColor: currentPage === pageNumber ? "#ccc" : "" }}
                        >
                            {pageNumber}
                        </button>
                    ))}
                    <button className="pag-button" onClick={handleNext} disabled={currentPage === totalPage}>
                        Next
                    </button>
                </div>
            }
        </div>
    )
}

export default PostList