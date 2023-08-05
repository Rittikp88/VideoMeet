import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {Routes , Route} from 'react-router-dom'
// import './App.css'
import Looby from './screens/Looby'
import RoomPage from './screens/Room'

function App() {

  return (
    <>
     <Routes>
      <Route path='/' element ={<Looby />} />
      <Route path='/room/:roomId' element ={<RoomPage />} />
     </Routes> 
    </>
  )
}

export default App
