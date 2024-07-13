import { useContext } from "react"
import IsFriendsContext from "../context/IsFriendsProvider"

const useIsFriends = () => {
  return useContext(IsFriendsContext)
}

export default useIsFriends
