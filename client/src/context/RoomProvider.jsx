import PropTypes from 'prop-types'
import { createContext, useState } from "react"

const RoomContext = createContext({})

export const RoomProvider = ({ children }) => {
  const [room, setRoom] = useState('')

  return (
    <RoomContext.Provider value={{ room, setRoom }} >
      {children}
    </RoomContext.Provider>
  )
}

export default RoomContext

RoomProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
