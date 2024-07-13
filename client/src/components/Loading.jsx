
const Loading = () => {
  return (
    <div className="loading fixed inset-0 bg-black bg-opacity-50 z-9999 flex items-center justify-center">
      <div className="flex items-center justify-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20"></div>
      </div>
    </div>
  )
}

export default Loading
