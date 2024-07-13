import Send from "../components/Send"
import Head from "../components/Head"
import Messages from "../components/Messages"
import useOpenedChat from '../hooks/useOpenedChat'


const Conversation = () => {
  const { openedChat } = useOpenedChat()

  return (
    <div className="w-full mx-6">
      {openedChat?.type
        ? <>
          <Head />
          <Messages />
          <Send />
        </>
        : <div>
          <h2 className="h-screen flex justify-center items-center font-bold">
            Select a conversation to start chatting
          </h2>
        </div>
      }
    </div>
  )
}

export default Conversation
