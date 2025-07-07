import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer } from 'react-toastify'

import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import CategoryList from './pages/category/CategoryList'
import PostList from './pages/post/PostList'
import Profile from './pages/Profile'
import Setting from './pages/Setting'
import PrivateLayout from './components/layout/PrivateLayout'

import Login from './pages/Login'
import Signup from './pages/Signup'
import PublicLayout from './components/layout/PublicLayout'

import NewCategory from './pages/category/NewCategory'
import UpdateCategory from './pages/category/UpdateCategory'

import NewPost from './pages/post/NewPost'
import DetailPost from './pages/post/DetailPost'
import UpdatePost from './pages/post/UpdatePost'

function App() {
  return (
    <>
      <Routes>
        <Route element={<PrivateLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='category' element={<CategoryList />} />
          <Route path='category/new-category' element={<NewCategory />} />
          <Route path='category/update-category' element={<UpdateCategory />} />

          <Route path='posts' element={<PostList />} />
          <Route path='posts/add-post' element={<NewPost />} />
          <Route path='posts/detail-post' element={<DetailPost />} />
          <Route path='posts/update-post' element={<UpdatePost />} />
          
          <Route path='profile' element={<Profile />} />
          <Route path='setting' element={<Setting />} />
        </Route>
        <Route element={<PublicLayout />}>
          <Route path='signup' element={<Signup />} />
          <Route path='login' element={<Login />} />
        </Route>
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  )
}

export default App