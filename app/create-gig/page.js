'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateGigPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    deliveryDays: '',
    image: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
    if (status === 'authenticated' && session.user.role !== 'seller') {
      router.push('/')
    }
  }, [status])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.title || !formData.description || !formData.category || !formData.price || !formData.deliveryDays) {
      setError('All fields are required')
      return
    }

    if (formData.price < 1) {
      setError('Price must be at least ₹1')
      return
    }

    if (formData.deliveryDays < 1) {
      setError('Delivery days must be at least 1')
      return
    }

    setLoading(true)

    const res = await fetch('/api/gigs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        deliveryDays: Number(formData.deliveryDays),
        image: formData.image
      })
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
    } else {
      router.push('/dashboard/seller')
    }
  }

  return (
    <div style={{
      background: '#f7f7f7',
      minHeight: '100vh',
      padding: '32px 20px'
    }}>
      <div className="container" style={{ maxWidth: '680px' }}>

        {/* Back Button */}
        <Link href="/dashboard/seller" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: '#555',
          fontSize: '14px',
          marginBottom: '24px'
        }}>
          ← Back to Dashboard
        </Link>

        {/* Card */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #eee',
          padding: '36px'
        }}>

          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '6px' }}>
              Create a New Gig
            </h1>
            <p style={{ color: '#777', fontSize: '14px' }}>
              Fill in the details below to post your service on SmartWorkPlanet
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#fff5f5',
              border: '1px solid #ffcccc',
              color: '#e53935',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '24px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Title */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '6px'
              }}>
                Gig Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. I will build a professional website for you"
                required
                maxLength={100}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '15px',
                  outline: 'none',
                }}
              />
              <p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                {formData.title.length}/100 characters
              </p>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '6px'
              }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your service in detail. What will the buyer get? What do you need from them?"
                required
                rows={6}
                maxLength={1000}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '15px',
                  outline: 'none',
                  resize: 'vertical',
                  lineHeight: '1.6'
                }}
              />
              <p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                {formData.description.length}/1000 characters
              </p>
            </div>

            {/* Category */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '6px'
              }}>
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '15px',
                  outline: 'none',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select a category</option>
                <option value="Web Dev">Web Dev</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Content Writing">Content Writing</option>
              </select>
            </div>

            {/* Price & Delivery Days */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '6px'
                }}>
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  required
                  min={1}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '15px',
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '6px'
                }}>
                  Delivery Days
                </label>
                <input
                  type="number"
                  name="deliveryDays"
                  value={formData.deliveryDays}
                  onChange={handleChange}
                  placeholder="e.g. 3"
                  required
                  min={1}
                  max={30}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '15px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Image URL */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '6px'
              }}>
                Gig Image URL <span style={{ color: '#aaa', fontWeight: '400' }}>(optional)</span>
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '15px',
                  outline: 'none',
                }}
              />
              <p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                Paste a public image URL. Leave blank to use a default icon.
              </p>
            </div>

            {/* Preview Box */}
            {(formData.title || formData.price || formData.category) && (
              <div style={{
                background: '#f7f7f7',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '24px',
                border: '1px solid #eee'
              }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#aaa', marginBottom: '10px' }}>
                  PREVIEW
                </p>
                <p style={{ fontWeight: '700', fontSize: '15px', marginBottom: '6px' }}>
                  {formData.title || 'Your gig title'}
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {formData.category && (
                    <span style={{
                      background: '#e8f5e9', color: '#1dbf73',
                      fontSize: '12px', fontWeight: '600',
                      padding: '3px 10px', borderRadius: '20px'
                    }}>
                      {formData.category}
                    </span>
                  )}
                  {formData.price && (
                    <span style={{ fontSize: '14px', fontWeight: '700' }}>
                      ₹{formData.price}
                    </span>
                  )}
                  {formData.deliveryDays && (
                    <span style={{ fontSize: '13px', color: '#777' }}>
                      {formData.deliveryDays} day delivery
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#aaa' : '#1dbf73',
                color: '#fff',
                border: 'none',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Posting Gig...' : 'Post Gig'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}
