import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, Search, ShoppingBag, Menu, X, Heart, Star, Plus, Minus,
  Leaf, SlidersHorizontal, Check, Trash2, ChevronDown, UserRound, LogOut, PackageCheck
} from 'lucide-react'

type Product = {
  id: number; name: string; category: string; price: number; rating?: number
  tag?: string; imageUrl: string; description: string; stock?: number
}
type User = { id: number; name: string; email: string; role: string }
type CartItem = { product: Product; quantity: number }

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')
const demoProducts: Product[] = [
  { id: 1, name: 'Sage Ceramic Vase', category: 'Home & Living', price: 28, rating: 4.9, tag: 'BESTSELLER', imageUrl: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=85', description: 'A softly sculptural ceramic vase in a calming sage finish.', stock: 18 },
  { id: 2, name: 'Everyday Tote', category: 'Accessories', price: 32, rating: 4.8, tag: 'NEW', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=85', description: 'A dependable everyday carry-all with a clean silhouette.', stock: 25 },
  { id: 3, name: 'Botanical Candle', category: 'Wellness', price: 19, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=85', description: 'A slow-burning candle for softer evenings and thoughtful pauses.', stock: 30 },
  { id: 4, name: 'Minimal Desk Lamp', category: 'Home & Living', price: 64, rating: 4.7, tag: 'POPULAR', imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85', description: 'Warm, focused light with a timeless profile.', stock: 9 },
  { id: 5, name: 'Linen Cushion Cover', category: 'Home & Living', price: 24, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=85', description: 'A breathable linen-blend cover with a relaxed texture.', stock: 20 },
  { id: 6, name: 'Daily Water Bottle', category: 'Accessories', price: 26, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=85', description: 'A reusable bottle with a simple, durable design.', stock: 35 },
  { id: 7, name: 'Calm Ritual Set', category: 'Wellness', price: 38, rating: 5, tag: 'GIFT PICK', imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=85', description: 'A considered little set for your daily wind-down.', stock: 12 },
  { id: 8, name: 'Classic Notebook', category: 'Accessories', price: 15, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=85', description: 'A tactile notebook for ideas, lists and plans.', stock: 40 },
]
const categories = ['All products', 'Home & Living', 'Accessories', 'Wellness']
const money = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

async function api<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`)
  return body as T
}

function App() {
  const [products, setProducts] = useState<Product[]>(demoProducts)
  const [apiMode, setApiMode] = useState<'loading' | 'connected' | 'demo'>('loading')
  const [category, setCategory] = useState('All products')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')
  const [cart, setCart] = useState<Record<number, CartItem>>({})
  const [wishlist, setWishlist] = useState<number[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [selected, setSelected] = useState<Product | null>(null)
  const [notice, setNotice] = useState('')
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem('verdant_user') || 'null') as User | null } catch { return null }
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('verdant_token'))
  const [orders, setOrders] = useState<Array<{ id: number; status: string; total: number; createdAt?: string }>>([])
  const [ordersOpen, setOrdersOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkoutName, setCheckoutName] = useState('')
  const [checkoutAddress, setCheckoutAddress] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    api<{ products: Product[] }>('/products')
      .then(data => { if (active && data.products.length) { setProducts(data.products.map(p => ({ ...p, rating: 4.8 }))); setApiMode('connected') } else if (active) setApiMode('demo') })
      .catch(() => { if (active) setApiMode('demo') })
    return () => { active = false }
  }, [])

  const filteredProducts = useMemo(() => {
    let list = products.filter(p =>
      (category === 'All products' || p.category === category) &&
      `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(query.toLowerCase())
    )
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'rating') list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    return list
  }, [products, category, query, sort])

  const cartItems = Object.values(cart)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const flash = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 3200) }
  const addToCart = (product: Product) => {
    setCart(prev => ({ ...prev, [product.id]: { product, quantity: (prev[product.id]?.quantity || 0) + 1 } }))
    flash(`${product.name} added to your bag`)
  }
  const changeQty = (id: number, delta: number) => setCart(prev => {
    const next = { ...prev }
    const item = next[id]
    if (!item) return prev
    if (item.quantity + delta <= 0) delete next[id]
    else next[id] = { ...item, quantity: item.quantity + delta }
    return next
  })
  const toggleWishlist = (id: number) => setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const body = authMode === 'register'
      ? { name: String(form.get('name') || ''), email: String(form.get('email') || ''), password: String(form.get('password') || '') }
      : { email: String(form.get('email') || ''), password: String(form.get('password') || '') }
    setBusy(true)
    try {
      if (authMode === 'register') {
        await api('/auth/register', { method: 'POST', body: JSON.stringify(body) })
        flash('Account created. Please sign in.')
        setAuthMode('login')
      } else {
        const data = await api<{ token: string; user: User }>('/auth/login', { method: 'POST', body: JSON.stringify(body) })
        setToken(data.token); setUser(data.user)
        localStorage.setItem('verdant_token', data.token); localStorage.setItem('verdant_user', JSON.stringify(data.user))
        setAuthOpen(false); flash(`Welcome back, ${data.user.name}!`)
      }
    } catch (error) { flash(error instanceof Error ? error.message : 'Could not authenticate.') }
    finally { setBusy(false) }
  }

  const loadOrders = async () => {
    if (!token) { setAuthOpen(true); return }
    setBusy(true)
    try {
      const data = await api<{ orders: Array<{ id: number; status: string; total: number; createdAt?: string }> }>('/orders/my', {}, token)
      setOrders(data.orders); setOrdersOpen(true)
    } catch (error) { flash(error instanceof Error ? error.message : 'Could not load orders.') }
    finally { setBusy(false) }
  }

  const placeOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) { setCheckoutOpen(false); setAuthOpen(true); flash('Please sign in before placing an order.'); return }
    if (!cartItems.length) return
    setBusy(true)
    try {
      const data = await api<{ message: string; order: { id: number } }>('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: cartItems.map(item => ({ productId: item.product.id, quantity: item.quantity })),
          shippingName: checkoutName, shippingAddress: checkoutAddress,
        }),
      }, token)
      setCart({}); setCheckoutOpen(false); flash(`Order #${data.order.id} placed successfully!`)
    } catch (error) { flash(error instanceof Error ? error.message : 'Could not place order.') }
    finally { setBusy(false) }
  }

  const logout = () => {
    setToken(null); setUser(null); localStorage.removeItem('verdant_token'); localStorage.removeItem('verdant_user')
    setOrders([]); setOrdersOpen(false); flash('You have signed out.')
  }

  return <div className="app-shell">
    <div className="announcement"><Leaf size={14} /> A little more thoughtful. A little more you. <span>Free shipping on orders over $75</span></div>
    <header className="site-header">
      <button className="mobile-menu icon-button" aria-label="Toggle menu" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X /> : <Menu />}</button>
      <a href="#home" className="brand"><span className="brand-mark"><Leaf size={22} /></span><span>verdant<small>EVERYDAY, ELEVATED</small></span></a>
      <nav className={mobileMenu ? 'main-nav open' : 'main-nav'}>
        <a href="#shop" onClick={() => { setCategory('All products'); setMobileMenu(false) }}>Shop all</a>
        <a href="#shop" onClick={() => { setCategory('Home & Living'); setMobileMenu(false) }}>Home & living</a>
        <a href="#shop" onClick={() => { setCategory('Accessories'); setMobileMenu(false) }}>Accessories</a>
        <a href="#story" onClick={() => setMobileMenu(false)}>Our story</a>
        {user && <button className="nav-action" onClick={() => { void loadOrders(); setMobileMenu(false) }}>My orders</button>}
      </nav>
      <div className="header-actions">
        <label className="search-box"><Search size={17} /><input value={query} onChange={e => { setQuery(e.target.value); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }) }} placeholder="Search products" aria-label="Search products" /></label>
        {user ? <button className="account-button" onClick={logout} title={`Signed in as ${user.name}`}><LogOut size={18} /><span>Sign out</span></button> : <button className="account-button" onClick={() => setAuthOpen(true)}><UserRound size={18} /><span>Sign in</span></button>}
        <button className="bag-button" onClick={() => setCartOpen(true)} aria-label={`Shopping bag, ${cartCount} items`}><ShoppingBag size={21} /><span>Bag</span><b>{cartCount}</b></button>
      </div>
    </header>
    <main>
      <section className="hero" id="home">
        <div className="hero-copy"><div className="eyebrow"><span /> GOOD THINGS, MADE SIMPLE</div><h1>Make room for<br /><em>the good things.</em></h1><p>Thoughtful everyday essentials for a calmer home, a lighter routine and a life that feels a little more you.</p><div className="hero-actions"><a className="primary-button" href="#shop">Explore the collection <ArrowRight size={17} /></a><a className="text-link" href="#story">Our philosophy</a></div><div className="hero-proof"><div className="avatar-stack"><i>V</i><i>✿</i><i>✦</i></div><span><strong>Loved by everyday explorers</strong><small>Small choices. Better everyday.</small></span></div></div>
        <div className="hero-visual"><div className="hero-photo" role="img" aria-label="Calm natural home decor" /><div className="floating-note"><span className="note-icon"><Leaf size={19} /></span><span><b>Thoughtfully chosen</b><small>For the way you live</small></span></div><div className="hero-stamp"><span>LIVE</span><b>LIGHTLY</b><small>★ ★ ★ ★ ★</small></div></div>
        <div className="hero-bottom-label"><span>01 / THE EVERYDAY EDIT</span><span>DESIGNED TO FEEL LIKE HOME ↓</span></div>
      </section>
      <section className="values-strip"><div><Leaf /><span><b>Thoughtful by design</b><small>Useful things, chosen well</small></span></div><div><Check /><span><b>Quality that lasts</b><small>Made for everyday life</small></span></div><div><Heart /><span><b>A little less waste</b><small>Better choices, every day</small></span></div><div><ShoppingBag /><span><b>Easy, happy shopping</b><small>Simple from start to finish</small></span></div></section>
      <section className="shop-section section-wrap" id="shop">
        <div className="section-heading"><div><div className="eyebrow">THE EVERYDAY EDIT</div><h2>Find your <em>favourite.</em></h2><p>Useful little things that make every day feel special.</p></div><a className="text-link desktop-link" href="#shop" onClick={() => { setCategory('All products'); setQuery('') }}>View all products <ArrowRight size={16} /></a></div>
        <div className="shop-toolbar"><div className="category-tabs">{categories.map(c => <button key={c} className={category === c ? 'category-tab active' : 'category-tab'} onClick={() => setCategory(c)}>{c}</button>)}</div><label className="sort-control"><SlidersHorizontal size={15} /><span>Sort:</span><select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="rating">Top rated</option></select><ChevronDown size={14} /></label></div>
        <div className="product-grid">{filteredProducts.map(p => <article className="product-card" key={p.id}><div className="product-image-wrap" onClick={() => setSelected(p)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setSelected(p)}><img src={p.imageUrl} alt={p.name} loading="lazy" />{p.tag && <span className="product-tag">{p.tag}</span>}<button className={wishlist.includes(p.id) ? 'wishlist active' : 'wishlist'} onClick={e => { e.stopPropagation(); toggleWishlist(p.id) }} aria-label={`Toggle ${p.name} wishlist`}><Heart size={17} fill={wishlist.includes(p.id) ? 'currentColor' : 'none'} /></button><button className="quick-add" onClick={e => { e.stopPropagation(); addToCart(p) }}><Plus size={16} /> Quick add</button></div><div className="product-info"><div className="product-category">{p.category}</div><div className="product-name-row"><button onClick={() => setSelected(p)} className="product-name">{p.name}</button><span className="rating"><Star size={12} fill="currentColor" /> {(p.rating || 4.8).toFixed(1)}</span></div><div className="price-row"><b>{money(p.price)}</b></div><small className="stock-note">{typeof p.stock === 'number' ? (p.stock > 0 ? `${p.stock} in stock` : 'Out of stock') : 'Available'}</small></div></article>)}</div>
        {filteredProducts.length === 0 && <div className="empty-state"><Search size={25} /><h3>No little treasures found</h3><p>Try another search or browse all products.</p><button className="primary-button" onClick={() => { setQuery(''); setCategory('All products') }}>Show all products</button></div>}
        <div className="shop-bottom"><span>Showing {filteredProducts.length} thoughtful finds</span><span>{apiMode === 'connected' ? <><Check size={14} /> Live product API connected</> : apiMode === 'loading' ? 'Connecting to store…' : 'Preview mode · connect database to load live products'} <Leaf size={14} /></span></div>
      </section>
      <section className="story-section" id="story"><div className="story-image"><img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85" alt="Calm, light-filled living space" loading="lazy" /><div className="story-image-caption">A home that feels like you.</div></div><div className="story-copy"><div className="eyebrow">A NOTE FROM VERDANT</div><h2>Less noise.<br /><em>More meaning.</em></h2><p>We believe the things you live with should earn their place. That's why we look for thoughtful design, everyday usefulness and little details that make a difference.</p><p>Not more stuff. Just better things, chosen with care.</p><a href="#shop" className="primary-button">Shop our edit <ArrowRight size={17} /></a><div className="signature"><span>With care,</span><b>the verdant team</b></div></div></section>
      <section className="newsletter"><div className="newsletter-leaf"><Leaf size={30} /></div><div><div className="eyebrow">A LITTLE NOTE NOW AND THEN</div><h2>Good things in your inbox.</h2><p>Fresh finds, thoughtful ideas and 10% off your first order.</p></div><Newsletter onSubscribe={() => flash('Thanks for joining the Verdant community!')} /></section>
    </main>
    <footer className="site-footer"><div className="footer-top"><a href="#home" className="brand"><span className="brand-mark"><Leaf size={22} /></span><span>verdant<small>EVERYDAY, ELEVATED</small></span></a><p>Everyday essentials, thoughtfully chosen.</p><div className="footer-links"><a href="#shop">Shop</a><a href="#story">Our story</a><a href="mailto:hello@verdant.example">Contact</a></div></div><div className="footer-bottom"><span>© 2026 Verdant. Full-stack student project.</span><span>Made with care <Leaf size={13} /></span></div></footer>

    {notice && <div className="toast"><Check size={17} /> {notice}</div>}
    {cartOpen && <div className="overlay" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={e => e.stopPropagation()}><div className="drawer-heading"><div><span className="eyebrow">YOUR LITTLE FINDS</span><h2>Your bag <span>({cartCount})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close bag"><X /></button></div>
      {cartItems.length === 0 ? <div className="cart-empty"><ShoppingBag size={34} /><h3>Your bag is taking a breather.</h3><p>Let's find something lovely for your everyday.</p><button className="primary-button" onClick={() => setCartOpen(false)}>Explore products <ArrowRight size={16} /></button></div> : <><div className="cart-items">{cartItems.map(item => <div className="cart-item" key={item.product.id}><img src={item.product.imageUrl} alt={item.product.name} /><div className="cart-item-details"><b>{item.product.name}</b><span>{money(item.product.price)}</span><div className="quantity"><button onClick={() => changeQty(item.product.id, -1)} aria-label="Decrease quantity"><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => changeQty(item.product.id, 1)} aria-label="Increase quantity"><Plus size={13} /></button></div></div><button className="remove-item" onClick={() => setCart(prev => { const next = { ...prev }; delete next[item.product.id]; return next })} aria-label={`Remove ${item.product.name}`}><Trash2 size={16} /></button></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><b>{money(subtotal)}</b></div><p>Shipping and taxes calculated at checkout.</p><button className="primary-button checkout-button" onClick={() => { setCheckoutName(user?.name || ''); setCheckoutOpen(true); setCartOpen(false) }}>Continue to checkout <ArrowRight size={16} /></button><small>Orders are stored in the connected database. No payment provider is configured.</small></div></>}</aside></div>}

    {selected && <div className="overlay modal-overlay" onClick={() => setSelected(null)}><div className="product-modal" onClick={e => e.stopPropagation()}><button className="modal-close icon-button" onClick={() => setSelected(null)} aria-label="Close product details"><X /></button><img src={selected.imageUrl} alt={selected.name} /><div className="modal-info"><div className="eyebrow">{selected.category}</div><h2>{selected.name}</h2><div className="modal-rating"><Star size={14} fill="currentColor" /> {(selected.rating || 4.8).toFixed(1)} <span>·</span> Thoughtfully selected</div><div className="modal-price">{money(selected.price)}</div><p>{selected.description}</p><div className="detail-row"><span>Availability</span><b>{typeof selected.stock === 'number' ? `${selected.stock} in stock` : 'Available'}</b></div><button className="primary-button modal-add" onClick={() => { addToCart(selected); setSelected(null) }}>Add to bag <ShoppingBag size={17} /></button><small className="demo-note">Product data comes from the API when the database is configured.</small></div></div></div>}

    {authOpen && <div className="overlay modal-overlay" onClick={() => setAuthOpen(false)}><div className="auth-modal" onClick={e => e.stopPropagation()}><button className="modal-close icon-button" onClick={() => setAuthOpen(false)} aria-label="Close authentication"><X /></button><span className="auth-mark"><Leaf size={25} /></span><div className="eyebrow">WELCOME TO VERDANT</div><h2>{authMode === 'login' ? 'Good to see you.' : 'Make yourself at home.'}</h2><p>{authMode === 'login' ? 'Sign in to view your orders and check out.' : 'Create an account to place and track orders.'}</p><form onSubmit={submitAuth} className="auth-form">{authMode === 'register' && <label>Full name<input name="name" required minLength={2} maxLength={120} placeholder="Your name" /></label>}<label>Email address<input name="email" type="email" required placeholder="you@example.com" /></label><label>Password<input name="password" type="password" required minLength={authMode === 'register' ? 8 : 1} maxLength={100} placeholder={authMode === 'register' ? 'At least 8 characters' : 'Your password'} /></label><button className="primary-button checkout-button" disabled={busy}>{busy ? 'Please wait…' : authMode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={16} /></button></form><button className="switch-auth" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>{authMode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}</button><small className="demo-note">For your first admin user, register normally then update the role to admin in PostgreSQL.</small></div></div>}

    {checkoutOpen && <div className="overlay modal-overlay" onClick={() => setCheckoutOpen(false)}><div className="checkout-modal" onClick={e => e.stopPropagation()}><button className="modal-close icon-button" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout"><X /></button><span className="auth-mark"><PackageCheck size={25} /></span><div className="eyebrow">ALMOST YOURS</div><h2>Delivery details</h2><p>Review your details to place your order. Payment is not collected in this demo.</p><form onSubmit={placeOrder} className="auth-form"><label>Recipient name<input value={checkoutName} onChange={e => setCheckoutName(e.target.value)} required minLength={2} maxLength={120} /></label><label>Delivery address<textarea value={checkoutAddress} onChange={e => setCheckoutAddress(e.target.value)} required minLength={5} maxLength={1000} rows={3} placeholder="Street, city, postal code" /></label><div className="checkout-total"><span>Order total</span><b>{money(subtotal)}</b></div><button className="primary-button checkout-button" disabled={busy}>{busy ? 'Placing order…' : 'Place order'} <ArrowRight size={16} /></button></form><small className="demo-note">Sign in first. Real card payments are not enabled.</small></div></div>}

    {ordersOpen && <div className="overlay modal-overlay" onClick={() => setOrdersOpen(false)}><div className="orders-modal" onClick={e => e.stopPropagation()}><button className="modal-close icon-button" onClick={() => setOrdersOpen(false)} aria-label="Close orders"><X /></button><div className="eyebrow">YOUR ACCOUNT</div><h2>Order history</h2>{orders.length === 0 ? <div className="no-orders"><PackageCheck size={28} /><p>You haven't placed an order yet.</p></div> : <div className="order-list">{orders.map(order => <div className="order-row" key={order.id}><div><b>Order #{order.id}</b><small>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recently placed'}</small></div><div><b>{money(Number(order.total))}</b><small className="order-status">{order.status}</small></div></div>)}</div>}</div></div>}
  </div>
}

function Newsletter({ onSubscribe }: { onSubscribe: () => void }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  return <form className="newsletter-form" onSubmit={e => { e.preventDefault(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address.'); return } setError(''); onSubscribe(); setEmail('') }}><div className="newsletter-input"><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" aria-label="Your email address" required /><button type="submit" aria-label="Subscribe"><ArrowRight size={19} /></button></div>{error && <small className="form-error">{error}</small>}<small className="privacy-note">No spam. Just the good stuff.</small></form>
}
export default App
