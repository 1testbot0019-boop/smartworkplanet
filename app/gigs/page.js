'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function GigsPage() {
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    fetchGigs()
  }, [category])

  const fetchGigs = async () => {
    setLoading(true)
    const query = category !== 'All' ? `?category=${category}` : ''
    const res = await fetch(`/api/gigs${query}`)
    const data = await res.json()
    setGigs(data.gigs || [])
    setLoading(false)
  }

  const filtered = gigs.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f7' }}>

      {/* Top Bar */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #eee',
        padding: '24px 20px'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>
            Browse Gigs
          </h1>

          {/* Search */}
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <input
              type="text"
              placeholder="Search gigs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                width: '280px'
              }}
            />

            {/* Category Filter */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    background: category === cat ? '#1dbf73' : '#fff',
                    color: category === cat ? '#fff' : '#555',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gigs Grid */}
      <div className="container" style={{ padding: '32px 20px' }}>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#777' }}>
            Loading gigs...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            color: '#777'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>No gigs found</h3>
            <p>Try a different search or category</p>
          </div>
        ) : (
          <>
            <p style={{ color: '#777', fontSize: '14px', marginBottom: '20px' }}>
              {filtered.length} gig{filtered.length !== 1 ? 's' : ''} found
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '24px'
            }}>
              {filtered.map(gig => (
                <GigCard key={gig._id} gig={gig} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function GigCard({ gig }) {
  return (
    <Link href={`/gigs/${gig._id}`}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #eee',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >

        {/* Gig Image */}
        <div style={{
          height: '160px',
          background: gig.image ? `url(${gig.image}) center/cover` : '#e8f5e9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px'
        }}>
          {!gig.image && categoryIcon(gig.category)}
        </div>

        {/* Gig Info */}
        <div style={{ padding: '16px' }}>

          {/* Seller */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px'
          }}>
            <div style={{
              width: '28px', height: '28px',
              borderRadius: '50%',
              background: '#1dbf73',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '12px', fontWeight: '700'
            }}>
              {gig.sellerName?.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '13px', color: '#555', fontWeight: '500' }}>
              {gig.sellerName}
            </span>
          </div>

          {/* Title */}
          <h3 style={{
            fontSize: '15px',
            fontWeight: '600',
            color: '#222',
            marginBottom: '10px',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {gig.title}
          </h3>

          {/* Rating */}
          {gig.reviewCount > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '10px'
            }}>
              <span style={{ color: '#f5a623', fontSize: '14px' }}>★</span>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>
                {gig.rating.toFixed(1)}
              </span>
              <span style={{ fontSize: '13px', color: '#aaa' }}>
                ({gig.reviewCount})
              </span>
            </div>
          )}

          {/* Divider */}
          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px', marginTop: '4px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '12px', color: '#aaa' }}>Starting at</span>
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#222' }}>
                ₹{gig.price}
              </span>
            </div>
          </div>

        </div>
      </div>
    </Link>
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

const categories = ['All', 'Web Dev', 'Graphic Design', 'Content Writing']
