import PropTypes from 'prop-types'
import { createContext, useState } from "react"

const OpenedChatContext = createContext({})

export const OpenedChatProvider = ({ children }) => {
  const [openedChat, setOpenedChat] = useState({})

  return (
    <OpenedChatContext.Provider value={{ openedChat, setOpenedChat }} >
      {children}
    </OpenedChatContext.Provider>
  )
}

export default OpenedChatContext

OpenedChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
