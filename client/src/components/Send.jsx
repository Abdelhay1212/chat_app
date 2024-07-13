import { useState } from "react"
import { socket } from "../api/socket"
import useRoom from "../hooks/useRoom"
import useAuth from "../hooks/useAuth"

const Send = () => {
  const { auth } = useAuth()
  const { room } = useRoom()
  const [value, setValue] = useState('')

  const sendMessage = () => {
    if (value === '') return

    socket.emit('message', {
      message: value,
      room: room,
      user: auth.user
    })
    setValue('')
  }

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div className="p-4">
      <div className="relative flex justify-center items-center">
        <input
          type="text"
          value={value}
          onKeyUp={handleKeyUp}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Write Something"
          className="w-full py-3 pl-10 pr-24 mx-5 rounded-full bg-background outline-none caret-custom text-sm"
        />

        <div className="absolute top-3 left-8 flex place-content-center cursor-pointer">
          <svg
            className="w-3 fill-grey-light"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z" />
          </svg>
        </div>

        <div className="absolute top-3 right-20 flex place-content-center cursor-pointer">
          <svg
            className="w-4 fill-grey-light"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM164.1 325.5C182 346.2 212.6 368 256 368s74-21.8 91.9-42.5c5.8-6.7 15.9-7.4 22.6-1.6s7.4 15.9 1.6 22.6C349.8 372.1 311.1 400 256 400s-93.8-27.9-116.1-53.5c-5.8-6.7-5.1-16.8 1.6-22.6s16.8-5.1 22.6 1.6zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
          </svg>
        </div>

        <div className="absolute top-3 right-14 flex place-content-center cursor-pointer">
          <svg
            className="w-4 fill-grey-light"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z" />
          </svg>
        </div>

        <div onClick={sendMessage} className="absolute top-0 right-0 cursor-pointer w-12 h-11 bg-primary rounded-full flex place-content-center">
          <svg
            className="w-5 fill-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512">
            <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Send
