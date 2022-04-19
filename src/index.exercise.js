import React, {useState} from 'react'
import {createRoot} from 'react-dom/client'
import {Dialog} from '@reach/dialog'
import '@reach/dialog/styles.css'
import {Logo} from './components/logo'

function LoginForm({onSubmit, buttonText}) {
  function handleSubmit(event) {
    event.preventDefault()
    const {username, password} = event.target.elements

    onSubmit({username: username.value, password: password.value})
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" type="text"></input>
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password"></input>
      </div>
      <div>
        <button type="submit">{buttonText}</button>
      </div>
    </form>
  )
}

function App() {
  const [openModal, setOpenModal] = useState('none')

  function handleClick(event) {
    event.preventDefault()
    setOpenModal(event.target.innerHTML)
  }

  function handleSubmit(formData) {
    console.log(`${openModal}`, formData)
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
        <LoginForm onSubmit={handleSubmit} buttonText="Login"></LoginForm>
      </Dialog>
      <Dialog
        aria-label="Register form"
        role="dialog"
        isOpen={openModal.toLowerCase() === 'register'}
        onDismiss={() => setOpenModal('none')}
      >
        <button onClick={() => setOpenModal('none')}>Close</button>
        <h3>{openModal}</h3>
        <LoginForm onSubmit={handleSubmit} buttonText="Register"></LoginForm>
      </Dialog>
    </>
  )
}

const container = document.getElementById('root')
const root = createRoot(container)

root.render(<App />)
