import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import moment from 'moment'
import { Modal, Button } from "react-bootstrap"

import axios from "../../utils/AxiosInstance"

let url = '/getAllCategory'

let CategoryList = () => {
    let [loading, setLoading] = useState(false)
    let [category, setCategory] = useState([])
    let [totalPage, setTotalPage] = useState(1)
    let [currentPage, setCurrentPage] = useState(1)
    let [pageCount, setPageCount] = useState([])
    let [searchValue, setSearchValue] = useState("")
    let [showModal, setShowModal] = useState(false)
    let [categoryId, setCategoryId] = useState(null)

    let navigate = useNavigate()

    useEffect(() => {
        let getCategory = async () => {
            try {
                setLoading(true)
                let response = await axios.get(`${url}?page=${currentPage}&search=${searchValue}`)

                setCategory(response.data.data)
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

        getCategory()
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
        let response = await axios.get(`${url}?search=${input}&page=${currentPage}`)
        let data = response.data

        setCategory(data.data)
        setTotalPage(data.pages)
    }

    let handleDelete = async () => {
        try {
            let response = await axios.delete(`/deleteCategory?categoryId=${categoryId}`)
            setShowModal(false)
            toast.success(response?.data?.message || "Category Deleted Successfully!")

            let response1 = await axios.get(`${url}?page=${currentPage}&search=${searchValue}`)

            setCategory(response1.data.data)
            setTotalPage(response1.data.pages)
        } catch (error) {
            setShowModal(false)
            const message = error?.response?.data?.message || "Something went wrong"
            toast.error(message)
        }
    }

    return (
        <div>
            <button className="button button-block" onClick={() => navigate("new-category")}>Add New Category</button>
            <h2 className="table-title">Category List</h2>
            <input className="search-input" type="text" name="search" placeholder="Search Here" onChange={handleSearch} />

            {loading ? 'Loading.....' : <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {category.map((cat) => (
                        <tr key={cat._id}>
                            <td>{cat.title}</td>
                            <td>{cat.desc}</td>
                            <td>{moment(cat.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                            <td>{moment(cat.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                            <th>
                                <button className="button" onClick={() => navigate(`update-category?categoryId=${cat._id}`)}>Update</button>
                                <button className="button" onClick={() => {
                                    setShowModal(true)
                                    setCategoryId(cat._id)
                                }}>Delete</button>
                            </th>
                        </tr>
                    ))}
                </tbody>
            </table>
            }

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

            <Modal show={showModal} onHide={() => {
                setShowModal(false)
                setCategoryId(null)
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure you want to delete this category?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <div style={{ margin: '0 auto' }}>
                        <Button className="no-button" onClick={() => {
                            setShowModal(false)
                            setCategoryId(null)
                        }}>No</Button>
                        <Button className="yes-button" onClick={handleDelete}>Yes</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CategoryList