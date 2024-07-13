import { useState } from 'react'
import axios from '../api/axios'
import Loading from '../components/Loading'
import { Link, useNavigate } from 'react-router-dom'

const FULLN_REGEX = /^[a-zA-Z'’-]{2,20} [a-zA-Z'’-]{2,20}$/
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]{2,20}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/
const PASSWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{12,64}$/

const Register = () => {
  const navigate = useNavigate()

  const [error, setError] = useState({})
  const [showLoading, setShowLoading] = useState(false)
  const [showEye, setShowEye] = useState({ passwdEye: false, confirmPasswdEye: false })
  const [isPasswdVisible, setIsPasswdVisible] = useState({ passwd: false, confirmPasswd: false })
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [isValid, setIsValid] = useState({ fullName: false, email: false, password: false, confirmPassword: false })

  const validateInputs = (name, value) => {
    let validationError = ''

    if (name === 'fullName' && !FULLN_REGEX.test(value)) {
      validationError = `${name} must be two words, each one with 2-20 characters. Only letters, apostrophes, hyphens, and dashes are allowed.`
    } else if (name === 'email' && !EMAIL_REGEX.test(value)) {
      validationError = `${name} must be 2-20 characters, valid email format.`
    } else if (name === 'password' && !PASSWD_REGEX.test(value)) {
      validationError = `${name} must be 12-64 characters, include uppercase, lowercase, and a digit.`
    } else if (name === 'confirmPassword' && value !== formData.password) {
      validationError = `Passwords should match each other.`
    }

    if (validationError) {
      setError((prevError) => ({ ...prevError, [name]: { err: true, msg: validationError } }))
      setIsValid((prevIsValid) => ({ ...prevIsValid, [name]: false }))
    } else {
      setError((prevError) => ({ ...prevError, [name]: { err: false, msg: '' } }))
      setIsValid((prevIsValid) => ({ ...prevIsValid, [name]: true }))
    }
  }

  const getFormData = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prevData => ({ ...prevData, [name]: type === 'checkbox' ? checked : value }))
    validateInputs(name, value)
  }

  const registerReq = async (event) => {
    event.preventDefault()
    setShowLoading(true)

    let allValid = true
    Object.values(isValid).forEach((value) => {
      if (!value) {
        allValid = false
      }
    })

    if (!allValid) {
      setShowLoading(false)
      setError({ error: { err: true, msg: 'All fields should be valid!' } })
      return
    }

    const url = '/auth/register'
    const headers = { 'Content-Type': 'application/json' }
    const requestOptions = {
      headers: headers,
      withCredentials: true
    }

    try {
      const response = await axios.post(url, JSON.stringify(formData), requestOptions)
      setShowLoading(false)
      if (response.status === 201) {
        console.log(response.data)
        navigate('/login')
      }
    } catch (err) {
      setShowLoading(false)

      if (err.response) {
        if (err.response.status === 409) {
          setError({ error: { err: true, msg: 'The resource already exists.' } })
        } else if (err.response.status === 500) {
          setError({ error: { err: true, msg: 'Server error, Please try again later!' } })
        } else {
          setError({ error: { err: true, msg: err.response.data.error || 'An error occurred.' } })
        }
      } else if (err.request) {
        console.log('Error request:', err.request)
        setError({ error: { err: true, msg: 'No response received from the server. Please try again later!' } })
      } else {
        console.log('Error message:', err.message)
        setError({ error: { err: true, msg: 'Something went wrong. Please try again later!' } })
      }
    }
  }

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-primary md:text-2xl">
              Create an account
            </h1>
            <form onSubmit={registerReq} className="space-y-4 md:space-y-6">
              {(error?.error?.err) &&
                <p className="text-[#dc3545] bg-[#f9e1e3] font-medium text-sm p-2 rounded">{error.error.msg}</p>
              }
              <div>
                <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-900">Full Name</label>
                <input
                  type="fullName"
                  name="fullName"
                  id="fullName"
                  value={formData.fullName}
                  onChange={getFormData}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="e.g. Bonnie Green"
                  autoComplete="off"
                  minLength={5}
                  maxLength={40}
                  required
                />
                {(error?.fullName?.err) &&
                  <p className="text-[#dc3545] font-small text-sm mt-2">{error.fullName.msg}</p>
                }
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={getFormData}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="name@company.com"
                  autoComplete="off"
                  minLength={10}
                  maxLength={100}
                  required
                />
                {(error?.email?.err) &&
                  <p className="text-[#dc3545] font-small text-sm mt-2">{error.email.msg}</p>
                }
              </div>
              <div className='relative'>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                <input
                  type={isPasswdVisible.passwd ? 'text' : 'password'}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={getFormData}
                  onFocus={() => setShowEye({ ...showEye, passwdEye: true })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="••••••••"
                  autoComplete="off"
                  maxLength={64}
                  minLength={12}
                  required
                />
                <div className={`absolute top-0 right-0 ${showEye.passwdEye ? '' : 'hidden'}`}>
                  <svg className='absolute top-11 right-3 w-4 cursor-pointer' fill='#ccc' onClick={() => setIsPasswdVisible({ ...isPasswdVisible, passwd: false })} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg>
                  <svg className={`absolute top-11 right-3 ${isPasswdVisible.passwd ? 'hidden' : ''} w-4 cursor-pointer`} fill='#ccc' onClick={() => setIsPasswdVisible({ ...isPasswdVisible, passwd: true })} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" /></svg>
                </div>
                {(error?.password?.err) &&
                  <p className="text-[#dc3545] font-small text-sm mt-2">{error.password.msg}</p>
                }
              </div>
              <div className='relative'>
                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900">Confirm password</label>
                <input
                  type={isPasswdVisible.confirmPasswd ? 'text' : 'password'}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={getFormData}
                  onFocus={() => setShowEye({ ...showEye, confirmPasswdEye: true })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="••••••••"
                  autoComplete="off"
                  minLength={12}
                  maxLength={64}
                  required
                />
                <div className={`absolute top-0 right-0 ${showEye.confirmPasswdEye ? '' : 'hidden'}`}>
                  <svg className='absolute top-11 right-3 w-4 cursor-pointer' fill='#ccc' onClick={() => setIsPasswdVisible({ ...isPasswdVisible, confirmPasswd: false })} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg>
                  <svg className={`absolute top-11 right-3 ${isPasswdVisible.confirmPasswd ? 'hidden' : ''} w-4 cursor-pointer`} fill='#ccc' onClick={() => setIsPasswdVisible({ ...isPasswdVisible, confirmPasswd: true })} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" /></svg>
                </div>
                {(error?.confirmPassword?.err) &&
                  <p className="text-[#dc3545] font-small text-sm mt-2">{error.confirmPassword.msg}</p>
                }
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    defaultChecked={true}
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-light text-gray-500">I accept the <a className="font-medium text-primary hover:underline" href="#">Terms and Conditions</a></label>
                </div>
              </div>
              <button type="submit" className="w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Create an account</button>
              <p className="text-sm font-light text-gray-500">
                Already have an account? <Link to='/login' className="font-medium text-primary hover:underline">Login here</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      {showLoading && <Loading />}
    </section>
  )
}

export default Register
