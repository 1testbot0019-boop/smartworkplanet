'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function BuyerDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
    if (status === 'authenticated') {
      if (session.user.role !== 'buyer') router.push('/')
      else fetchOrders()
    }
  }, [status])

  const fetchOrders = async () => {
    const res = await fetch('/api/buyer/orders')
    const data = await res.json()
    setOrders(data.orders || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px', color: '#777' }}>
        Loading dashboard...
      </div>
    )
  }

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(o => o.status === activeTab)

  const totalSpent = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.amount, 0)

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
            <h1 style={{ fontSize: '26px', fontWeight: '700' }}>Buyer Dashboard</h1>
            <p style={{ color: '#777', fontSize: '14px', marginTop: '4px' }}>
              Welcome back, {session?.user?.name}
            </p>
          </div>
          <Link href="/gigs">
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
              Browse Gigs
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
            { label: 'Total Spent', value: `₹${totalSpent}`, color: '#1dbf73', bg: '#f0fdf4' },
            { label: 'Total Orders', value: orders.length, color: '#2196f3', bg: '#e3f2fd' },
            { label: 'Active Orders', value: activeOrders, color: '#ff9800', bg: '#fff3e0' },
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

        {/* Orders Section */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #eee',
          padding: '24px'
        }}>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700' }}>
              My Orders
            </h3>

            {/* Filter Tabs */}
            <div style={{
              display: 'flex',
              gap: '4px',
              background: '#f7f7f7',
              borderRadius: '8px',
              padding: '4px'
            }}>
              {['all', 'pending', 'active', 'completed', 'cancelled'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '7px 14px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
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
          </div>

          {filteredOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div style={{ fontSize: '52px', marginBottom: '14px' }}>🛒</div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#333' }}>
                No orders found
              </h3>
              <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '20px' }}>
                {activeTab === 'all'
                  ? "You haven't placed any orders yet"
                  : `No ${activeTab} orders`}
              </p>
              <Link href="/gigs">
                <button style={{
                  background: '#1dbf73', color: '#fff',
                  border: 'none', padding: '12px 24px',
                  borderRadius: '8px', fontSize: '15px',
                  fontWeight: '600', cursor: 'pointer'
                }}>
                  Browse Gigs
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '14px' }}>
              {filteredOrders.map(order => (
                <div key={order._id} style={{
                  padding: '18px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>

                  {/* Order Info */}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '6px' }}>
                      {order.gigTitle}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <p style={{ fontSize: '13px', color: '#aaa' }}>
                        Seller: <span style={{ color: '#555', fontWeight: '500' }}>{order.sellerName}</span>
                      </p>
                      <p style={{ fontSize: '13px', color: '#aaa' }}>
                        Ordered: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Price & Status */}
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: '700', fontSize: '18px', marginBottom: '6px' }}>
                      ₹{order.amount}
                    </p>
                    <StatusBadge status={order.status} />
                  </div>

                  {/* View Gig Button */}
                  <Link href={`/gigs/${order.gigId}`}>
                    <button style={{
                      background: '#f7f7f7',
                      color: '#555',
                      border: '1px solid #eee',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      View Gig
                    </button>
                  </Link>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #eee',
          padding: '24px',
          marginTop: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            width: '56px', height: '56px',
            borderRadius: '50%',
            background: '#1dbf73',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '22px', fontWeight: '700',
            flexShrink: 0
          }}>
            {session?.user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: '700', fontSize: '17px' }}>{session?.user?.name}</p>
            <p style={{ fontSize: '14px', color: '#777' }}>{session?.user?.email}</p>
            <p style={{ fontSize: '13px', color: '#1dbf73', marginTop: '2px', fontWeight: '600' }}>
              Buyer Account
            </p>
          </div>
          <div style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '20px', fontWeight: '800', color: '#222' }}>{orders.length}</p>
              <p style={{ fontSize: '12px', color: '#aaa' }}>Total Orders</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '20px', fontWeight: '800', color: '#1dbf73' }}>₹{totalSpent}</p>
              <p style={{ fontSize: '12px', color: '#aaa' }}>Total Spent</p>
            </div>
          </div>
        </div>

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
      textTransform: 'capitalize'
    }}>
      {status}
    </span>
  )
}
