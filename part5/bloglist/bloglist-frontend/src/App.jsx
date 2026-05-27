import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import CreateBlog from './components/CreateBlog'
import Notification from './components/Notification'

import {
  Routes, Route, Link, useNavigate, useMatch
} from 'react-router-dom'
import BlogList from './components/BlogList'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    ).catch(() => {
      setNotification({ message: 'Failed to get data — server may be down', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat({ ...returnedBlog, user }))
      navigate('/')
      setNotification({ message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, type: 'success' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      setNotification({ message: error.response.data.error, type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const addLike = async (id, blogObject) => {
    try {
      const updatedBlog = await blogService.update(id, blogObject)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : { ...updatedBlog, user: blogObject.user })
        .sort((a, b) => b.likes - a.likes))
      setNotification({ message: `liked ${updatedBlog.title}`, type: 'success' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      setNotification({ message: error.response.data.error, type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const deleteBlog = async (blog) => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        await blogService.blogDelete(blog.id)
        navigate('/')
        setNotification({ message: `${blog.title} by ${blog.author} deleted`, type: 'success' })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      }
    } catch (error) {
      setNotification({ message: error.response.data.error, type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBloglistAppUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setNotification({ message:`${user.name} logged in`, type: 'success' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)

      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      setNotification({ message: 'wrong username or password', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistAppUser')
    navigate('/')
    setNotification({ message: 'logged out', type: 'success' })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
    setUser(null)
  }

  const match = useMatch('/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  return (
    <Container>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>

          <Button color='inherit' component={Link} to="/">blogs</Button>
          {user ? (
            <>
              <Button color='inherit' component={Link} to="/create">new blog</Button>
              <Button color='inherit' onClick={handleLogout}>logout</Button>
            </>
          ): (
            <Button color='inherit' component={Link} to="/login">login</Button>
          )}
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

      <Routes>
        <Route path="/" element={
          <BlogList blogs={blogs} addLike={addLike} deleteBlog={deleteBlog} user={user} />
        } />

        <Route path="/:id" element={
          <Blog            
            blog={blog}
            addLike={addLike}
            deleteBlog={deleteBlog}
            user={user}
          />
        } />

        <Route path="/create" element={
          <CreateBlog createBlog={addBlog} />
        }/>

        <Route path="/login" element={
          <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
        } />
      </Routes>
    </Container>
  )
}

export default App