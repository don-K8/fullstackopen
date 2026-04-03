const Header = ({ name }) => <h2>{name}</h2>

const Part = ({part}) => <p>{part.name} {part.exercises}</p>

const Total = ({parts}) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)

  return (
    <p><b>Total of {total} exercises</b></p>
  )  
}

const Content = ({ parts }) => parts.map(part => <Part key={part.id} part={part}/>)

const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name}/>
      <Content parts={course.parts} />
      <Total parts={course.parts}/>
    </div>
  )
}

export default Course