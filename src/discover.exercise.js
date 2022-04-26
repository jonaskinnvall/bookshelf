/** @jsx jsx */
import {jsx} from '@emotion/core'
import React from 'react'

import './bootstrap'
import Tooltip from '@reach/tooltip'
import {FaSearch} from 'react-icons/fa'
import {Input, BookListUL, Spinner} from './components/lib'
import {BookRow} from './components/book-row'
import {client} from './utils/api-client'

function DiscoverBooksScreen() {
  const [status, setStatus] = React.useState('idle')
  const [queried, setQueried] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [data, setData] = React.useState(null)

  React.useEffect(() => {
    if (!queried) return

    setStatus('loading')
    client(`books?query=${encodeURIComponent(query)}`).then(data => {
      setData(data)
      setStatus('success')
    })

    setStatus('idle')
    setQueried(false)
  }, [queried, query])

  const isLoading = status === 'loading' ? true : false
  const isSuccess = status === 'success' ? true : false

  function handleSearchSubmit(event) {
    event.preventDefault()

    setQueried(true)
    const {search} = event.target.elements
    setQuery(search.value)
  }

  return (
    <div
      css={{maxWidth: 800, margin: 'auto', width: '90vw', padding: '40px 0'}}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search books..."
          id="search"
          css={{width: '100%'}}
        />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: '0',
                position: 'relative',
                marginLeft: '-35px',
                background: 'transparent',
              }}
            >
              {isLoading ? <Spinner /> : <FaSearch aria-label="search" />}
            </button>
          </label>
        </Tooltip>
      </form>

      {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{marginTop: 20}}>
            {data.books.map(book => (
              <li key={book.id} aria-label={book.title}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>No books found. Try another search.</p>
        )
      ) : null}
    </div>
  )
}

export {DiscoverBooksScreen}
