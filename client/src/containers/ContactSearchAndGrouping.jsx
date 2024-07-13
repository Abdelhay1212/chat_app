import { socket } from '../api/socket'
import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import useOpenedChat from '../hooks/useOpenedChat'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import defaultImage from '../assets/default.jpg'


const ContactSearchAndGrouping = () => {
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const { setOpenedChat } = useOpenedChat()
  const [errMsg, setErrMsg] = useState('')
  const [showSideBar, setShowSideBar] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [newGroupName, setNewGroupName] = useState('')
  const [existingGroupId, setExistingGroupId] = useState('')

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery === '') return
      try {
        const response = await axiosPrivate.get(`/home/people?search=${searchQuery}`)
        setSearchResults(response?.data?.results)
      } catch (err) {
        console.error(err)
      }
    }
    handleSearch()
  }, [searchQuery, axiosPrivate])

  useEffect(() => {
    setErrMsg('')
  }, [newGroupName])

  const openChat = (otherUser) => {
    socket.emit('open_chat', { otherUserId: otherUser._id, user: auth.user })
    setOpenedChat({
      '_id': null,
      type: 'private',
      friend_id: otherUser._id,
      title: otherUser.fullName,
      image: otherUser?.profilePicture
        ? `http://localhost:5000/static/images${otherUser.profilePicture}`
        : defaultImage
    })
    setSearchQuery('')
    setShowSideBar(false)
  }

  const handleError = (err) => {
    if (err?.response) {
      console.error(err?.response?.data?.error)
      setErrMsg('An error occurred. Try again later!')
    } else if (err?.request) {
      console.error('Error request:', err?.request)
      setErrMsg('No response received from the server. Please try again later!')
    } else {
      console.error('Error message:', err?.message)
      setErrMsg('Something went wrong. Please try again later!')
    }
  }

  const handleCreateGroup = async () => {
    try {
      const response = await axiosPrivate.post(`/home/group/create`, { 'name': newGroupName })
      socket.emit('open_chat', { chat_id: response.data.group_data._id, user: auth.user })
      setOpenedChat({
        _id: response.data.group_data._id,
        title: response.data.group_data.name,
        type: response.data.group_data.type,
        image: response.data.group_data?.groupImage
          ? `http://localhost:5000/static/images/${response.data.group_data.groupImage}`
          : defaultImage
      })
      setNewGroupName('')
    } catch (err) {
      handleError(err)
    }
  }

  const handleJoinGroup = async () => {
    try {
      const response = await axiosPrivate.put(`/home/group/join`, { 'id': existingGroupId })
      socket.emit('open_chat', { chat_id: response.data.group_data._id, user: auth.user })
      setOpenedChat({
        _id: response.data.group_data._id,
        title: response.data.group_data.name,
        type: response.data.group_data.type,
        image: response.data.group_data?.groupImage
          ? `http://localhost:5000/static/images/${response.data.group_data.groupImage}`
          : defaultImage
      })
      setExistingGroupId('')
    } catch (err) {
      handleError(err)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowSideBar(prev => !prev)}
        className="fixed top-4 right-4 z-50 bg-primary text-white px-4 py-2 rounded-md focus:outline-none"
      >
        {showSideBar
          ? <span>&#8667;</span>
          : <span>&#8666;</span>
        }
      </button>

      <div
        className={`fixed top-0 right-0 w-80 h-screen bg-background shadow-lg transform transition-transform duration-300 ease-in-out ${showSideBar ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="h-screen mt-14 p-6 space-y-6">
          {errMsg && <p className="p-2 text-[#FF0000]">{errMsg}</p>}

          <div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find people..."
              className="w-full px-4 py-2 rounded-full outline-none caret-custom placeholder-[#ccc] text-sm border border-gray-300"
            />
          </div>

          {searchResults.length > 0 && searchQuery !== '' ? (
            <div className="mt-4">
              <ul className="space-y-2 h-[500px] overflow-y-scroll">
                {searchResults.map((otherUser) => (
                  <li key={otherUser._id} className="p-3 bg-gray-100 rounded-md flex items-center">
                    <div className="rounded-full w-10 h-10 overflow-hidden bg-gray-200">
                      <img
                        className="w-full h-full object-cover"
                        src={otherUser?.profilePicture
                          ? `http://localhost:5000/static/images/${otherUser?.profilePicture}`
                          : defaultImage
                        }
                        alt="Person"
                      />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-primary text-md font-semibold">
                        {otherUser?.fullName}
                      </h2>
                    </div>
                    <div
                      className="ml-auto"
                      onClick={() => openChat(otherUser)}
                    >
                      <svg
                        className="w-6 cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path fill="#ccc" d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z" />
                      </svg>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            searchQuery !== '' && <div className="mt-4">No results found</div>
          )}

          {searchQuery === '' && (
            <div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="New group name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-4 py-2 rounded-full outline-none caret-custom placeholder-[#ccc] text-sm border border-gray-300"
                />
                <button
                  onClick={handleCreateGroup}
                  className="w-full px-4 py-2 bg-primary text-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                >
                  Create Group
                </button>
              </div>

              <div className="space-y-2 mt-5">
                <input
                  type="text"
                  placeholder="Existing group ID"
                  value={existingGroupId}
                  onChange={(e) => setExistingGroupId(e.target.value)}
                  className="w-full px-4 py-2 rounded-full outline-none caret-custom placeholder-[#ccc] text-sm border border-gray-300"
                />
                <button
                  onClick={handleJoinGroup}
                  className="w-full px-4 py-2 bg-primary text-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                >
                  Join Group
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ContactSearchAndGrouping
