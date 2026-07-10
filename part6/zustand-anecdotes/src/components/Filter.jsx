import {useAnecdoteActions, useAnecdotes} from "../store.js";

const Filter = () => {
  const { setFilter } = useAnecdoteActions()
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter
      <input onChange={(e) => setFilter(e.target.value)}/>
    </div>
  )
}

export default Filter