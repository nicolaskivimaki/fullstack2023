import { useState } from 'react'
import Notification from './components/Notification'
import Home from './components/Home'
import Footer from './components/Footer'
import CreateNew from './components/CreateNew'
import Anecdote from './components/Anecdote'
import About from './components/About'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useNavigate,
  useMatch
} from "react-router-dom"


const App = () => {

    const [anecdotes, setAnecdotes] = useState([
        {
          content: 'If it hurts, do it more often',
          author: 'Jez Humble',
          info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
          votes: 0,
          id: 1
        },
        {
          content: 'Premature optimization is the root of all evil',
          author: 'Donald Knuth',
          info: 'http://wiki.c2.com/?PrematureOptimization',
          votes: 0,
          id: 2
        }
      ])
    
    const [notification, setNotification] = useState('')

    const addNew = (anecdote) => {
        anecdote.id = Math.round(Math.random() * 10000)
        setAnecdotes(anecdotes.concat(anecdote))
        setNotification(`a new anecdote ${anecdote.content} created!`)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
    }

    const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

    const vote = (id) => {
        const anecdote = anecdoteById(id)

        const voted = {
            ...anecdote,
            votes: anecdote.votes + 1
        }

        setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
    }

    const match = useMatch('/anecdotes/:id')

    const anecdote = match
    ? anecdotes.find(anecdote => anecdote.id === Number(match.params.id))
    : null

    const padding = {
        padding: 5
    }

    return (
        <div>
            <h1>Software anecdotes</h1>
            <div>
                <Link style={padding} to="/">anecdotes</Link>
                <Link style={padding} to="/create">create new</Link>
                <Link style={padding} to="/about">about</Link>
            </div>
            <Notification message={notification} />
            <Routes>
                <Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote} />} />
                <Route path="/about" element={<About />} />
                <Route path="/create" element={<CreateNew addNew={addNew} />} />
                <Route path="/" element={<Home anecdotes={anecdotes} />} />
            </Routes>
            <div>
                <Footer />
            </div>
        </div>
    )
}

export default App