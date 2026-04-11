import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notifications'

const Filter = ({filter, onChange}) => {
  return (
      <div>
        filter shown with <input value={filter} onChange={onChange}/>
      </div>
  )
}

const PersonForm = (props) => {
  return (
      <form onSubmit={props.onSubmit}>
        <div>
          <div>name: <input value={props.nameVal} onChange={props.nameChange}/></div>
          <div>number: <input value={props.numberVal} onChange={props.numberChange}/></div>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = ({ filtered, onDelete }) => (
  <div>
    {filtered.map(person => 
      <p key={person.name}>
        {person.name} {person.number}  
        <button onClick={() => onDelete(person.id, person.name)}>
          delete
        </button>
      </p>
    )}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initalPersons => {
        setPersons(initalPersons)
      })
      .catch(() => {
        setNotification({message: 'Failed to get data — server may be down', type: 'error'})
        setTimeout(() => {
          setNotification(null)
        }, 5000);
      })
  }, [])

  const addPerson = (e) => {
    e.preventDefault()
    const existing = persons.find(person => person.name === newName)

    if (existing) {
      const confirmed = confirm(
      `${newName} is already added to phonebook. Replace the number?`
      )
      if (confirmed) {
        personService
          .update(existing.id, { ...existing, number:newNumber})
          .then(returned => {
            setPersons(persons.map(p => p.id === existing.id ? returned : p))
            setNotification({message: `${existing.name}'s number is updated`, type: 'success'})
            setTimeout(() => {
              setNotification(null)
            }, 5000);
            setNewName('')
            setNewNumber('')
          })
          .catch(() => {
            setNotification({message:`Failed to update ${existing.name}'s number`, type: 'error'})
            setTimeout(() => {
              setNotification(null)
            }, 5000);
          })
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNotification({message: 'New person is added', type: 'success'})
        setTimeout(() => {
          setNotification(null)
        }, 5000);
        setNewName('')
        setNewNumber('')
      })
      .catch((error) => {
        setNotification({message: error.response.data.error , type: 'error'})
        setTimeout(() => {
          setNotification(null)
        }, 5000);
      })
  }

  const filtered = persons.filter(person => 
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  const handleDelete = (id, name) => {
    const confirmed = confirm(`Delete ${name}?`)
    if (confirmed) {
      personService
        .deletePerson(id)  
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNotification({message: `${name} is deleted`, type: 'success'})
          setTimeout(() => {
            setNotification(null)
          }, 5000);
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setNotification({message: `${name} has already been deleted`, type : 'error'})
            setTimeout(() => {
              setNotification(null)
            }, 5000);
            setPersons(persons.filter(p => p.id !== id))      
          } else {
            setNotification({message: 'Failed to Delete', type: 'error'})
            setTimeout(() => {
              setNotification(null)
            }, 5000);
          }          

        }) 
    }
  }
  

  const handleFilterChange = (e) => setFilter(e.target.value)
  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification}/>
      <Filter value={filter} onChange={handleFilterChange} />      
      <h2>add a new</h2>  
      <PersonForm 
        onSubmit={addPerson}
        nameVal={newName}
        numberVal={newNumber}
        nameChange={handleNameChange}
        numberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons filtered={filtered} onDelete={handleDelete} />
    </div>
  )
}

export default App