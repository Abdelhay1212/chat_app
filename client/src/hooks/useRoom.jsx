import { useContext } from "react"
import RoomContext from "../context/RoomProvider"

const useRoom = () => {
  return useContext(RoomContext)
}

export default useRoom
