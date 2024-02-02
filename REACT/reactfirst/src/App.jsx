
import './App.css'
import Header from './components/Header'
import Buttonlist from './components/Button'
function App() {
const liste = ['Dies ist ein Button','Ebense','Sowieso']
  return (
    <>
      <Header info='Dies ist mein Header'/>
      <Buttonlist myarray={liste}/>

    </>
  )
}

export default App
