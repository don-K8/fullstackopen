import AnecdoteForm from "./components/AnecdoteForm.jsx";
import AnecdoteList from "./components/AnecdoteList.jsx";
import Filter from "./components/Filter.jsx";
import {useAnecdoteActions} from "./store.js";
import {useEffect} from "react";

const App = () => {
  const { initialize } = useAnecdoteActions()

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div>
      <Filter/>
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App