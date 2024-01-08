import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Error from './components/Error'
import BlogForm from "./components/BlogForm"
import Togglable from "./components/Togglable"
import Footer from './components/Footer'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        setBlogs(initialBlogs)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(() => {
        blogService.getAll().then(initialBlogs => {
          setBlogs(initialBlogs)
        })
        setNotification(`Yay! You successfully added ${blogObject.title} by ${blogObject.author}!`)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
      .catch(error => {
        setErrorMessage('title or url missing')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const changeLikesOfBlog = id => {
    const blog = blogs.find(n => n.id === id)
    const changedBlog = {
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }

    blogService
      .update(id, changedBlog)
      .then(() => {
        blogService.getAll().then(initialBlogs => {
          setBlogs(initialBlogs)
        })
      })
  }
  
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
}

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const handleBlogDelete = id => {
    const blog = blogs.find(b => b.id === id)
    const confirmation = window.confirm(
      `Are you sure you want to delete
       ${blog.title} by ${blog.author}?`
    )

    if (confirmation) {
        blogService
            .deleteBlog(id)
            .then(() => {
                setBlogs(originalBlogs => originalBlogs.filter(({ id }) => id !== blog.id))
                setNotification(`Deleted ${blog.title} by ${blog.author}`)
                setTimeout(() => {
                  setNotification(null)
                }, 5000)
            })
    }
}

  if (user === null) {
    return (
      <div>
        <h1>Log in to application</h1>
        <Error message={errorMessage} />
        <Notification message={notification} />
        { loginForm() }
      </div>
    )
  }

  return (
    <div>
      <h1>Blogs</h1>
      <Error message={errorMessage} />
      <Notification message={notification} />
      <div>
        <p>{user.name} logged in</p>
        <form onSubmit={handleLogout}>
            <button type="submit">logout</button>
        </form>
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
        {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
          <Blog key={blog.id} blog={blog} 
          changeLikesOfBlog={() => changeLikesOfBlog(blog.id)}
          handleBlogDelete={() => handleBlogDelete(blog.id)}
          user={user}/>
        )}
      </div>
    </div>
  )
}


export default App
