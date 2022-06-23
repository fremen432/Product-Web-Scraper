import { useState } from 'react'

function App() {
  const [name, setName] = useState('')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(0)
  const [condition, setCondition] = useState([])
  
  // const [condition: Array<number>, setCondition] = useState([])
  /* 
    Conditions:
      New: 1
      like new: 2
      excelent: 3
      good: 4
      fair: 5
      salvage: 6

  */
  return <h1>Hi</h1>
}

export default App
