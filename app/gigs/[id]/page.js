'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function GigDetailPage({ params }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [gig, setGig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ordering, setOrdering] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchGig()
  }, [])

  const fetchGig = async () => {
    const res = await fetch(`/api/gigs/${params.id}`)
    const data = await res.json()
    setGig(data.gig)
    setLoading(false)
  }

  const handleOrder = async () => {
    if (!session) {
      router.push('/auth/login')
      return
    }

    if (session.user.role === 'seller') {
      setError('Sellers cannot place orders. Login as a buyer.')
      return
    }

    setOrdering(true)
    setError('')

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gigId: gig._id })
    })

    const data = await res.json()
    setOrdering(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
    } else {
      setSuccess('Order placed successfully!')
      setTimeout(() => router.push('/dashboard/buyer'), 2000)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px', color: '#777' }}>
        Loading gig...
      </div>
    )
  }

  if (!gig) {
    return (
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <h2>Gig not found</h2>
        <Link href="/gigs" style={{ color: '#1dbf73' }}>Back to gigs</Link>
      </div>
    )
  }

  const platformFee = Math.round(gig.price * 0.15)
  const sellerEarning = gig.price - platformFee

  return (
    <div style={{ background: '#f7f7f7', minHeight: '100vh', padding: '32px 20px' }}>
      <div className="container">

        {/* Back Button */}
        <Link href="/gigs" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: '#555',
          fontSize: '14px',
          marginBottom: '24px'
        }}>
          ← Back to Gigs
        </Link>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '28px',
          alignItems: 'start'
        }}>

          {/* Left Column */}
          <div>

            {/* Gig Image */}
            <div style={{
              background: gig.image ? `url(${gig.image}) center/cover` : '#e8f5e9',
              borderRadius: '12px',
              height: '320px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '80px',
              border: '1px solid #eee'
            }}>
              {!gig.image && categoryIcon(gig.category)}
            </div>

            {/* Gig Title */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              border: '1px solid #eee',
              padding: '28px'
            }}>
              {/* Category Badge */}
              <span style={{
                background: '#e8f5e9',
                color: '#1dbf73',
                fontSize: '12px',
                fontWeight: '600',
                padding: '4px 12px',
                borderRadius: '20px',
                display: 'inline-block',
                marginBottom: '14px'
              }}>
                {gig.category}
              </span>

              <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '16px', lineHeight: '1.4' }}>
                {gig.title}
              </h1>

              {/* Seller Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
                paddingBottom: '20px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <div style={{
                  width: '44px', height: '44px',
                  borderRadius: '50%',
                  background: '#1dbf73',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '18px', fontWeight: '700'
                }}>
                  {gig.sellerName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '15px' }}>{gig.sellerName}</p>
                  <p style={{ fontSize: '13px', color: '#777' }}>Seller</p>
                </div>

                {/* Rating */}
                {gig.reviewCount > 0 && (
                  <div style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span style={{ color: '#f5a623', fontSize: '16px' }}>★</span>
                    <span style={{ fontWeight: '600' }}>{gig.rating.toFixed(1)}</span>
                    <span style={{ color: '#aaa', fontSize: '13px' }}>({gig.reviewCount} reviews)</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                About this Gig
              </h3>
              <p style={{
                color: '#555',
                fontSize: '15px',
                lineHeight: '1.8',
                whiteSpace: 'pre-line'
              }}>
                {gig.description}
              </p>

              {/* Delivery Info */}
              <div style={{
                display: 'flex',
                gap: '24px',
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid #f0f0f0'
              }}>
                <div>
                  <p style={{ fontSize: '13px', color: '#aaa' }}>Delivery Time</p>
                  <p style={{ fontWeight: '600', fontSize: '15px' }}>{gig.deliveryDays} day{gig.deliveryDays > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#aaa' }}>Category</p>
                  <p style={{ fontWeight: '600', fontSize: '15px' }}>{gig.category}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#aaa' }}>Orders</p>
                  <p style={{ fontWeight: '600', fontSize: '15px' }}>{gig.reviewCount} completed</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column - Order Card */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #eee',
            padding: '24px',
            position: 'sticky',
            top: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '15px', color: '#777' }}>Price</span>
              <span style={{ fontSize: '32px', fontWeight: '800', color: '#222' }}>₹{gig.price}</span>
            </div>

            <div style={{
              background: '#f7f7f7',
              borderRadius: '8px',
              padding: '14px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#777' }}>Delivery</span>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>{gig.deliveryDays} day{gig.deliveryDays > 1 ? 's' : ''}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#777' }}>Platform fee (15%)</span>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>₹{platformFee}</span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                paddingTop: '8px', borderTop: '1px solid #e0e0e0'
              }}>
                <span style={{ fontSize: '13px', color: '#777' }}>Seller earns</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1dbf73' }}>₹{sellerEarning}</span>
              </div>
            </div>

            {error && (
              <div style={{
                background: '#fff5f5',
                border: '1px solid #ffcccc',
                color: '#e53935',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '13px'
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#16a34a',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '13px'
              }}>
                {success}
              </div>
            )}

            <button
              onClick={handleOrder}
              disabled={ordering}
              style={{
                width: '100%',
                background: ordering ? '#aaa' : '#1dbf73',
                color: '#fff',
                border: 'none',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: ordering ? 'not-allowed' : 'pointer',
                marginBottom: '12px'
              }}
            >
              {ordering ? 'Placing Order...' : 'Order Now'}
            </button>

            {!session && (
              <p style={{ textAlign: 'center', fontSize: '13px', color: '#aaa' }}>
                <Link href="/auth/login" style={{ color: '#1dbf73' }}>Login</Link> to place an order
              </p>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

function categoryIcon(cat) {
  const icons = {
    'Web Dev': '💻',
    'Graphic Design': '🎨',
    'Content Writing': '✍️',
  }
  return icons[cat] || '🛠️'
}
