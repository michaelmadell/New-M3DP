'use client'

import { useState } from 'react'
import Model3DViewer from '@/components/Model3DViewer'

interface UploadedFile {
  name: string
  size: number
  type: string
  data: ArrayBuffer
}

export default function QuotePage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles) return

    const newFiles: UploadedFile[] = []
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      const data = await file.arrayBuffer()
      
      newFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        data,
      })
    }
    
    setFiles([...files, ...newFiles])
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Create FormData for file uploads
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('email', formData.email)
      submitData.append('phone', formData.phone)
      submitData.append('message', formData.message)
      
      // Add files to FormData
      files.forEach((file, index) => {
        const blob = new Blob([file.data])
        submitData.append(`file_${index}`, blob, file.name)
      })

      const response = await fetch('/api/quotes', {
        method: 'POST',
        body: submitData,
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', phone: '', message: '' })
        setFiles([])
      } else {
        alert('Failed to submit quote request. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting quote:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || ''
  }

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-4">Quote Request Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your quote request. We'll review your files and get back to you within 24-48 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn btn-primary"
          >
            Submit Another Quote
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Request a Custom 3D Print Quote</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-gray-600 mb-6">
            Upload your 3D model files (STL, OBJ, 3MF, STEP) and we'll provide you with a detailed quote
            including material options, print time, and pricing.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                required
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                required
                className="input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                className="input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Additional Details
              </label>
              <textarea
                rows={4}
                className="input"
                placeholder="Quantity, material preferences, deadline, etc."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Upload 3D Files (STL, OBJ, 3MF, STEP)
              </label>
              <input
                title='Upload File(s)'
                type="file"
                multiple
                accept=".stl,.obj,.3mf,.step,.stp"
                onChange={handleFileUpload}
                className="block btn w-full text-sm text-[var(--color-primary-foreground)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-secondary)] file:text-[var(--color-secondary-foreground)] hover:file:bg-[var(--color-primary)] hover:file:cursor-pointer hover:file:text-[var(--color-primary-foreground)]"
              />
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploaded Files:</p>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-[var(--color-secondary)] p-3 rounded">
                    <span className="text-sm text-[var(--color-secondary-foreground)]">{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-[var(--color-secondary-foreground)] hover:text-[var(--color-destructive)] bg-[var(--color-destructive)] hover:bg-red-100 hover:cursor-pointer rounded px-2 py-1 transition duration-300 ease-in-out hover:shadow hover:shadow-[var(--color-destructive)] text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || files.length === 0}
              className="btn bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary)] hover:text-[var(--color-primary-foreground)] hover:shadow hover:shadow-[var(--color-primary)]  hover:cursor-pointer transition duration-300 ease-in-out w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Quote Request'}
            </button>
          </form>
        </div>

        <div>
          {files.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">3D Preview</h3>
              <Model3DViewer 
                modelData={files[0].data} 
                fileType={getFileExtension(files[0].name)}
              />
              <p className="text-sm text-[var(--color-foreground)] mt-2 text-center">
                Showing: {files[0].name}
              </p>
            </div>
          )}
          
          {files.length === 0 && (
            <div className="bg-[var(--color-surface)] rounded-lg p-8 text-center h-96 flex items-center justify-center">
              <div>
                <p className="text-gray-500 mb-2">Upload a 3D file to see preview</p>
                <p className="text-sm text-gray-400">Supported: STL, OBJ, 3MF, STEP</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
