let addPostValidator = ({ title, category }) => {
    let errors = { title: "", category: "" }

    if (!title) {
        errors.title = "Title is required"
    }
    if (!category) {
        errors.category = "Select Category"
    }
    return errors
}

export default addPostValidator