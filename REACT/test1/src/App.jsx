import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Buttonlist from './components/Buttonlist'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header info="hallo"/>
      <Buttonlist myarray={["hug","hug","wug"]}/>
    </>
  )
}

export default App
