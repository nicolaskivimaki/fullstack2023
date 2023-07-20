const Header = ({course}) => {
  console.log(course)

  return (
    <div>
      <h1>
        {course.name}
      </h1>
    </div>
  )
}

const Content = ({parts}) => {
  console.log(parts)

  return (
    <div>
      {parts.map(part =>
        <Part key={part.id} part={part} />
      )}
    </div>
  )
}

const Part = ({part}) => {
  console.log(part)

  return (
    <div>
      <p>
        {part.name} {part.exercises}
      </p>
    </div>
  )
}

const Total = ({ parts }) => {
  console.log(parts)
  const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0)

  return (
    <div>
      <h3> Total of {totalExercises} exercises </h3>
    </div>
  )
}

const Course = ({course}) => {
    console.log(course)
  
    return (
      <div>
        <Header course={course} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  }

export default Course