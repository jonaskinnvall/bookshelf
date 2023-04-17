import * as React from 'react'
import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Modal, ModalContents, ModalOpenButton} from '../modal'

test('can be opened and closed', async () => {
  const label = 'Modal Label'
  const title = 'Modal Title'
  const content = 'Modal Content'

  render(
    <Modal>
      <ModalOpenButton>
        <button>Open</button>
      </ModalOpenButton>
      <ModalContents aria-label={label} title={title}>
        {content}
      </ModalContents>
    </Modal>,
  )
  const button = screen.getByRole('button', {
    name: /open/i,
  })

  await userEvent.click(button)

  const modal = screen.getByRole('dialog')
  expect(modal).toHaveAttribute('aria-label', label)
  const inModal = within(modal)
  expect(inModal.getByRole('heading', {name: title})).toBeInTheDocument()
  expect(inModal.getByText(content)).toBeInTheDocument()
  const closeButton = screen.getByRole('button', {name: /close/i})

  await userEvent.click(closeButton)

  const dialog = screen.queryByRole('dialog', {name: /login form/i})
  expect(dialog).not.toBeInTheDocument()
})
