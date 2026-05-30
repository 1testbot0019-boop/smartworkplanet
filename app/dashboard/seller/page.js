'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SellerDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [gigs, setGigs] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
    if (status === 'authenticated') {
      if (session.user.role !== 'seller') router.push('/')
      else fetchData()
    }
  }, [status])

  const fetchData = async () => {
    const [gigsRes, ordersRes] = await Promise.all([
      fetch('/api/seller/gigs'),
      fetch('/api/seller/orders')
    ])
    const gigsData = await gigsRes.json()
    const ordersData = await ordersRes.json()
    setGigs(gigsData.gigs || [])
    setOrders(ordersData.orders || [])
    setLoading(false)
  }

  const deleteGig = async (gigId) => {
    if (!confirm('Are you sure you want to delete this gig?')) return
    const res = await fetch(`/api/gigs/${gigId}`, { method: 'DELETE' })
    if (res.ok) setGigs(gigs.filter(g => g._id !== gigId))
  }

  const updateOrderStatus = async (orderId, status) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    if (res.ok) {
      setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o))
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px', color: '#777' }}>
        Loading dashboard...
      </div>
    )
  }

  const totalEarnings = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.sellerEarning, 0)

  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const activeOrders = orders.filter(o => o.status === 'active').length
  const completedOrders = orders.filter(o => o.status === 'completed').length

  return (
    <div style={{ background: '#f7f7f7', minHeight: '100vh', padding: '32px 20px' }}>
      <div className="container">

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '700' }}>Seller Dashboard</h1>
            <p style={{ color: '#777', fontSize: '14px', marginTop: '4px' }}>
              Welcome back, {session?.user?.name}
            </p>
          </div>
          <Link href="/create-gig">
            <button style={{
              background: '#1dbf73',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              + Post New Gig
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          {[
            { label: 'Total Earnings', value: `₹${totalEarnings}`, color: '#1dbf73', bg: '#f0fdf4' },
            { label: 'Active Gigs', value: gigs.length, color: '#2196f3', bg: '#e3f2fd' },
            { label: 'Pending Orders', value: pendingOrders, color: '#ff9800', bg: '#fff3e0' },
            { label: 'Completed Orders', value: completedOrders, color: '#9c27b0', bg: '#f3e5f5' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: stat.bg,
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #eee'
            }}>
              <p style={{ fontSize: '13px', color: '#777', marginBottom: '8px' }}>{stat.label}</p>
              <p style={{ fontSize: '28px', fontWeight: '800', color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: '#fff',
          borderRadius: '10px',
          padding: '4px',
          border: '1px solid #eee',
          marginBottom: '24px',
          width: 'fit-content'
        }}>
          {['overview', 'gigs', 'orders'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '9px 22px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                background: activeTab === tab ? '#1dbf73' : 'transparent',
                color: activeTab === tab ? '#fff' : '#777',
                textTransform: 'capitalize',
                transition: 'all 0.2s'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
          }}>

            {/* Recent Orders */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              border: '1px solid #eee',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '16px' }}>
                Recent Orders
              </h3>
              {orders.length === 0 ? (
                <p style={{ color: '#aaa', fontSize: '14px' }}>No orders yet</p>
              ) : (
                orders.slice(0, 4).map(order => (
                  <div key={order._id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '600' }}>{order.gigTitle}</p>
                      <p style={{ fontSize: '12px', color: '#aaa' }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: '#1dbf73' }}>
                        ₹{order.sellerEarning}
                      </p>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* My Gigs */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              border: '1px solid #eee',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '16px' }}>
                My Gigs
              </h3>
              {gigs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '12px' }}>
                    No gigs yet
                  </p>
                  <Link href="/create-gig">
                    <button style={{
                      background: '#1dbf73', color: '#fff',
                      border: 'none', padding: '10px 20px',
                      borderRadius: '8px', fontSize: '14px',
                      fontWeight: '600', cursor: 'pointer'
                    }}>
                      Create Your First Gig
                    </button>
                  </Link>
                </div>
              ) : (
                gigs.slice(0, 4).map(gig => (
                  <div key={gig._id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '600' }}>{gig.title}</p>
                      <p style={{ fontSize: '12px', color: '#aaa' }}>{gig.category}</p>
                    </div>
                    <p style={{ fontSize: '15px', fontWeight: '700' }}>₹{gig.price}</p>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* Gigs Tab */}
        {activeTab === 'gigs' && (
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #eee',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '20px' }}>
              My Gigs ({gigs.length})
            </h3>
            {gigs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
                <p style={{ color: '#aaa', marginBottom: '16px' }}>You have no gigs yet</p>
                <Link href="/create-gig">
                  <button style={{
                    background: '#1dbf73', color: '#fff',
                    border: 'none', padding: '12px 24px',
                    borderRadius: '8px', fontSize: '15px',
                    fontWeight: '600', cursor: 'pointer'
                  }}>
                    Post Your First Gig
                  </button>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '14px' }}>
                {gigs.map(gig => (
                  <div key={gig._id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '10px',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>
                        {gig.title}
                      </p>
                      <p style={{ fontSize: '13px', color: '#aaa' }}>
                        {gig.category} • {gig.deliveryDays} day delivery • ₹{gig.price}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link href={`/gigs/${gig._id}`}>
                        <button style={{
                          background: '#f0f0f0', color: '#555',
                          border: 'none', padding: '8px 16px',
                          borderRadius: '6px', fontSize: '13px',
                          fontWeight: '600', cursor: 'pointer'
                        }}>
                          View
                        </button>
                      </Link>
                      <button
                        onClick={() => deleteGig(gig._id)}
                        style={{
                          background: '#fff5f5', color: '#e53935',
                          border: '1px solid #ffcccc', padding: '8px 16px',
                          borderRadius: '6px', fontSize: '13px',
                          fontWeight: '600', cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #eee',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '20px' }}>
              All Orders ({orders.length})
            </h3>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
                <p style={{ color: '#aaa' }}>No orders yet</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '14px' }}>
                {orders.map(order => (
                  <div key={order._id} style={{
                    padding: '16px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '10px',
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      flexWrap: 'wrap',
                      gap: '12px',
                      marginBottom: '12px'
                    }}>
                      <div>
                        <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>
                          {order.gigTitle}
                        </p>
                        <p style={{ fontSize: '13px', color: '#aaa' }}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: '700', fontSize: '16px', color: '#1dbf73' }}>
                          ₹{order.sellerEarning}
                        </p>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {order.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => updateOrderStatus(order._id, 'active')}
                          style={{
                            background: '#e3f2fd', color: '#1565c0',
                            border: 'none', padding: '7px 16px',
                            borderRadius: '6px', fontSize: '13px',
                            fontWeight: '600', cursor: 'pointer'
                          }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order._id, 'cancelled')}
                          style={{
                            background: '#fff5f5', color: '#e53935',
                            border: '1px solid #ffcccc', padding: '7px 16px',
                            borderRadius: '6px', fontSize: '13px',
                            fontWeight: '600', cursor: 'pointer'
                          }}
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    {order.status === 'active' && (
                      <button
                        onClick={() => updateOrderStatus(order._id, 'completed')}
                        style={{
                          background: '#f0fdf4', color: '#16a34a',
                          border: '1px solid #bbf7d0', padding: '7px 16px',
                          borderRadius: '6px', fontSize: '13px',
                          fontWeight: '600', cursor: 'pointer'
                        }}
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    pending:   { bg: '#fff3e0', color: '#e65100' },
    active:    { bg: '#e3f2fd', color: '#1565c0' },
    completed: { bg: '#f0fdf4', color: '#16a34a' },
    cancelled: { bg: '#fff5f5', color: '#e53935' },
  }
  const s = styles[status] || styles.pending
  return (
    <span style={{
      background: s.bg,
      color: s.color,
      fontSize: '11px',
      fontWeight: '600',
      padding: '3px 10px',
      borderRadius: '20px',
      display: 'inline-block',
      marginTop: '4px',
      textTransform: 'capitalize'
    }}>
      {status}
    </span>
  )
}
