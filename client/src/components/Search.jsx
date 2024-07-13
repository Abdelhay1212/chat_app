import PropTypes from 'prop-types'
import useAuth from '../hooks/useAuth'
import { socket } from '../api/socket'

const Search = ({ chats, setChats }) => {
  const { auth } = useAuth()

  const searchFriends = (e) => {
    const value = e.target.value

    if (value.trim() === '') {
      socket.timeout(5000).emit('get_chats')
    }

    const result = chats.filter(chat => {
      if (chat.type === 'private') {
        const member = chat.members.find(m => m.username !== auth.user.username)
        return member.fullName.toLowerCase().includes(value)
      } else {
        return chat.name.toLowerCase().includes(value)
      }
    })
    setChats(result)
  }

  return (
    <div className="p-4 relative z-10">
      <div className="relative flex justify-center items-center">
        <input
          type="search"
          onChange={searchFriends}
          placeholder="Search Friends"
          autoComplete="off"
          className="w-full p-2 pl-10 rounded-full outline-none caret-custom placeholder-[#ccc] text-sm"
        />
        <svg
          className="absolute top-3 left-4 fill-[#ccc] w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512">
          <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
        </svg>
      </div>
    </div>
  )
}

Search.propTypes = {
  chats: PropTypes.array.isRequired,
  setChats: PropTypes.func.isRequired
}

export default Search
