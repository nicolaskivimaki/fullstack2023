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
  const [newBlog, setNewBlog] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
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

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      url: url,
      title: title,
      author: author
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setUrl('')
        setTitle('')
        setAuthor('')
        blogFormRef.current.toggleVisibility()
        setNotification(`Yay! You successfully added ${blogObject.title} by ${blogObject.author}!`)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
  }

  const handleBlogChange = (event) => {
    setNewBlog(event.target.value)
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
        <Togglable buttonLabel="new note" ref={blogFormRef}>
            <BlogForm
              addBlog={addBlog}
              title={title}
              handleTitleChange={({ target }) => setTitle(target.value)}
              author={author}
              handleAuthorChange={({ target }) => setAuthor(target.value)}
              url={url}
              handleUrlChange={({ target }) => setUrl(target.value)}
            />
          </Togglable>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    </div>
  )
}


export default App
