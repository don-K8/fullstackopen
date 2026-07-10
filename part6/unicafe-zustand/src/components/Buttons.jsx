import { useCounterControls } from "../store"

const Buttons = () => {
  const { good, neutral, bad } = useCounterControls()

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={good}>good</button>
      <button onClick={neutral}>neutral</button>
      <button onClick={bad}>bad</button>
    </div>
  )
}

export default Buttons
