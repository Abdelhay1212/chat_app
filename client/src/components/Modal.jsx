import { useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import PropTypes from 'prop-types'


const Modal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null)
  const [errMsg, setErrMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const axiosPrivate = useAxiosPrivate()

  if (!isOpen) return null

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setErrMsg('Please select a file')
      return
    }

    const formData = new FormData()
    formData.append('profileImage', file)

    try {
      const url = '/home/update_profile_image'
      await axiosPrivate.put(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSuccess(true)
    } catch (err) {
      if (err?.response) {
        console.error(err?.message)
        setErrMsg(err?.response?.data?.error || 'An error occurred.')
      } else if (err?.request) {
        console.error('Error request:', err?.request)
        setErrMsg('No response received from the server. Please try again later!')
      } else {
        console.error('Error message:', err?.message)
        setErrMsg('Something went wrong. Please try again later!')
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
      <h2 className="text-2xl font-semibold mb-4">Upload Profile Image:</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-2">
            Select an image:
          </label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {file && (
          <p className="text-sm text-gray-600 mb-4">
            Selected file: {file.name}
          </p>
        )}
        {errMsg && (
          <p className="text-sm text-[#DC3545] mb-4">
            {errMsg}
          </p>
        )}
        {success && (
          <p className="text-sm text-[#28A745] mb-4">
            Updated successfully
          </p>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded mr-2 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Close
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default Modal
