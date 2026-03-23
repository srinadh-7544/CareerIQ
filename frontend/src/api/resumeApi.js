import axios from 'axios'

export const uploadResume = async (file) => {
  const formData = new FormData()
  formData.append('resume_file', file)

  const response = await axios.post('/api/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const matchResume = async (file, jobDescription) => {
  const formData = new FormData()
  formData.append('resume_file', file)
  formData.append('job_description', jobDescription)

  const response = await axios.post('/api/resume/match', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}