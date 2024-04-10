import { Link } from 'react-router-dom';

const Anecdote = ({ anecdote }) => {

    return (
      <div>
        <h2>{anecdote.content} by {anecdote.author}</h2>
        <div>has {anecdote.votes} votes</div>
        <br />
        <div>for more info see <Link to={`${anecdote.info}`}>{anecdote.info}</Link></div>
        <br />
      </div>
    )
}

export default Anecdote