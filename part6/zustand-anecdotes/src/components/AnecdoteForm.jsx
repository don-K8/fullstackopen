import {useAnecdoteActions} from "../store.js";

const AnecdoteForm = () => {

  const { add } = useAnecdoteActions()

  const addAnecdote = (e) => {
    e.preventDefault()
    // noinspection JSUnresolvedReference
    const content = e.target.anecdote.value
    add(content)
    e.target.reset()
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote"/>
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm