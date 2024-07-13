import { useContext } from "react"
import OpenedChatContext from "../context/OpenedChatProvider"

const useOpenedChat = () => {
  return useContext(OpenedChatContext)
}

export default useOpenedChat
