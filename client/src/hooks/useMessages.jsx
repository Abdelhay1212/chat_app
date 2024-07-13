import { useContext } from "react"
import MessagesContext from "../context/MessagesProvider"

const useMessages = () => {
  return useContext(MessagesContext)
}

export default useMessages
