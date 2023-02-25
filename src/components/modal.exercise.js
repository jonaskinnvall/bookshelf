/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import VisuallyHidden from '@reach/visually-hidden'
import {Dialog, CircleButton} from './lib'

const callAll =
  (...fns) =>
  (...args) =>
    fns.forEach(fn => fn?.(...args))

const ModalContext = React.createContext()
ModalContext.displayName = 'ModalContext'

function Modal(props) {
  const [isOpen, setIsOpen] = React.useState(false)
  return <ModalContext.Provider value={[isOpen, setIsOpen]} {...props} />
}

function ModalDismissButton({children}) {
  const [, setIsOpen] = React.useContext(ModalContext)
  return React.cloneElement(children, {
    onClick: callAll(() => setIsOpen(false), children.props.onClick),
  })
}
function ModalOpenButton({children}) {
  const [, setIsOpen] = React.useContext(ModalContext)
  return React.cloneElement(children, {
    onClick: callAll(() => setIsOpen(true), children.props.onClick),
  })
}
function ModalContentsBase(props) {
  const [isOpen, setIsOpen] = React.useContext(ModalContext)
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  )
}

function ModalContents({title, children, ...props}) {
  return (
    <ModalContentsBase {...props}>
      <div css={{display: 'flex', justifyContent: 'flex-end'}}>
        <ModalDismissButton>
          <CircleButton>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
        </ModalDismissButton>
      </div>
      <h3 css={{textAlign: 'center', fontSize: '2em'}}>{title}</h3>
      {children}
    </ModalContentsBase>
  )
}

export {Modal, ModalDismissButton, ModalOpenButton, ModalContents}
