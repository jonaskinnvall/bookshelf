import React from 'react'
import {createRoot} from 'react-dom/client'
import {Logo} from './components/logo'

function App(params) {
  function handleClick(event) {
    event.preventDefault()
    alert(`${event.target.innerHTML} clicked`)
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
    </>
  )
}

const container = document.getElementById('root')
const root = createRoot(container)

root.render(<App />)
