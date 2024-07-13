import PropTypes from 'prop-types'
import { createContext, useState } from "react"

const MessagesContext = createContext({})

export const MessagesProvider = ({ children }) => {
  const [messages, setMessages] = useState([])

  return (
    <MessagesContext.Provider value={{ messages, setMessages }} >
      {children}
    </MessagesContext.Provider>
  )
}

export default MessagesContext

MessagesProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
