import PropTypes from "prop-types"
import { createContext, useState } from "react"

const IsFriendsContext = createContext({})

export const IsFriendsProvider = ({ children }) => {
  const [isFriends, setIsFriends] = useState(true)

  return (
    <IsFriendsContext.Provider value={{ isFriends, setIsFriends }}>
      {children}
    </IsFriendsContext.Provider>
  )
}

export default IsFriendsContext

IsFriendsProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
