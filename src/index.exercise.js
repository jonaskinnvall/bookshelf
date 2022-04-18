import React, {useState} from 'react'
import {createRoot} from 'react-dom/client'
import {Dialog} from '@reach/dialog'
import '@reach/dialog/styles.css'
import {Logo} from './components/logo'

function App() {
  const [openModal, setOpenModal] = useState('none')

  function handleClick(event) {
    event.preventDefault()
    setOpenModal(event.target.innerHTML)
  }

  return (
    <>
      <Logo width="80" height="80" /> <h1>Bookshelf</h1>
      <div>
        <button onClick={handleClick}>Login</button>
      </div>
      <div>
        <button onClick={handleClick}>Register</button>
      </div>
      <Dialog
        aria-label="Login form"
        isOpen={openModal.toLowerCase() === 'login'}
        onDismiss={() => setOpenModal('none')}
      >
        <button onClick={() => setOpenModal('none')}>Close</button>
        <h3>{openModal}</h3>
      </Dialog>
      <Dialog
        aria-label="Register form"
        role="dialog"
        isOpen={openModal.toLowerCase() === 'register'}
        onDismiss={() => setOpenModal('none')}
      >
        <button onClick={() => setOpenModal('none')}>Close</button>
        <h3>{openModal}</h3>
      </Dialog>
    </>
  )
}

const container = document.getElementById('root')
const root = createRoot(container)

root.render(<App />)
