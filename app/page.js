'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <div>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1dbf73 0%, #0a9d5a 100%)',
        padding: '80px 20px',
        textAlign: 'center',
        color: '#fff'
      }}>
        <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px' }}>
          Find Freelancers for Any Job
        </h1>
        <p style={{ fontSize: '20px', marginBottom: '32px', opacity: 0.9 }}>
          Hire skilled professionals or sell your services on SmartWorkPlanet
        </p>

        {/* Search Bar */}
        <div style={{
          display: 'flex',
          maxWidth: '560px',
          margin: '0 auto',
          background: '#fff',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}>
          <input
            type="text"
            placeholder='Try "logo design" or "website"...'
            style={{
              flex: 1,
              padding: '16px 20px',
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              color: '#333'
            }}
          />
          <button style={{
            background: '#1dbf73',
            color: '#fff',
            border: 'none',
            padding: '16px 28px',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Search
          </button>
        </div>

        <p style={{ marginTop: '20px', fontSize: '14px', opacity: 0.8 }}>
          Popular: Web Development, Logo Design, Content Writing
        </p>
      </section>

      {/* Categories Section */}
      <section style={{ padding: '60px 20px', background: '#fff' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px', fontWeight: '700' }}>
            Browse by Category
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {categories.map((cat) => (
              <Link href={`/gigs?category=${cat.name}`} key={cat.name}>
                <div style={{
                  background: cat.bg,
                  borderRadius: '12px',
                  padding: '32px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  border: '1px solid #eee'
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>{cat.icon}</div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#222' }}>{cat.name}</h3>
                  <p style={{ fontSize: '13px', color: '#888', marginTop: '6px' }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '60px 20px', background: '#f7f7f7' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px', fontWeight: '700' }}>
            How SmartWorkPlanet Works
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '30px',
            textAlign: 'center'
          }}>
            {steps.map((step, i) => (
              <div key={i} style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '32px 20px',
                border: '1px solid #eee'
              }}>
                <div style={{
                  width: '52px', height: '52px',
                  background: '#1dbf73',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: '#fff', fontSize: '22px', fontWeight: '700'
                }}>
                  {i + 1}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>{step.title}</h3>
                <p style={{ color: '#777', fontSize: '14px', lineHeight: '1.6' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        background: '#1dbf73',
        padding: '50px 20px',
        color: '#fff',
        textAlign: 'center'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '30px'
          }}>
            {stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: '40px', fontWeight: '800' }}>{s.value}</div>
                <div style={{ fontSize: '15px', opacity: 0.85, marginTop: '6px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '70px 20px', textAlign: 'center', background: '#fff' }}>
        <h2 style={{ fontSize: '34px', fontWeight: '800', marginBottom: '16px' }}>
          Ready to get started?
        </h2>
        <p style={{ color: '#777', fontSize: '18px', marginBottom: '32px' }}>
          Join thousands of freelancers and clients on SmartWorkPlanet
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth/register?role=buyer">
            <button style={{
              background: '#1dbf73', color: '#fff',
              border: 'none', padding: '14px 32px',
              borderRadius: '8px', fontSize: '16px', fontWeight: '600'
            }}>
              Hire a Freelancer
            </button>
          </Link>
          <Link href="/auth/register?role=seller">
            <button style={{
              background: '#fff', color: '#1dbf73',
              border: '2px solid #1dbf73', padding: '14px 32px',
              borderRadius: '8px', fontSize: '16px', fontWeight: '600'
            }}>
              Start Selling
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#222',
        color: '#aaa',
        textAlign: 'center',
        padding: '24px 20px',
        fontSize: '14px'
      }}>
        © 2024 SmartWorkPlanet. All rights reserved.
      </footer>

    </div>
  )
}

const categories = [
  { name: 'Web Dev', icon: '💻', desc: 'Websites, apps & more', bg: '#e8f5e9' },
  { name: 'Graphic Design', icon: '🎨', desc: 'Logos, banners & branding', bg: '#fff3e0' },
  { name: 'Content Writing', icon: '✍️', desc: 'Blogs, copy & articles', bg: '#e3f2fd' },
]

const steps = [
  { title: 'Post a Gig', desc: 'Sellers create a gig listing with their service, price and delivery time.' },
  { title: 'Get Hired', desc: 'Buyers browse gigs, place orders and make secure payments.' },
  { title: 'Deliver & Earn', desc: 'Complete the work, get paid directly to your account.' },
]

const stats = [
  { value: '500+', label: 'Freelancers' },
  { value: '1200+', label: 'Gigs Posted' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '₹50L+', label: 'Paid Out' },
]
