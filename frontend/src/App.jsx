import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Package, LogOut, Settings, Plus, Trash2, Edit } from 'lucide-react';

// API Base URL
const API_URL = 'http://localhost:8000';

// --- Components ---

function Navbar({ user, onLogout, cartCount }) {
  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">MicroShop</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Products</Link>
          {user && user.role === 'admin' && (
            <Link to="/admin" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={20} />
              <span>Admin</span>
            </Link>
          )}
          {user ? (
            <>
              <Link to="/cart" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingCart size={20} />
                <span>Cart ({cartCount})</span>
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={20} />
                <span>{user.username}</span>
              </div>
              <button onClick={onLogout} className="nav-link" style={{ background: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ width: 'auto', textDecoration: 'none' }}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function ProductList({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading products...</div>;

  return (
    <div className="container">
      <h1 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Featured Products</h1>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="card">
            <div className="card-image">
              <Package size={64} />
            </div>
            <div className="card-body">
              <h3 className="card-title">{product.name}</h3>
              <p className="card-price">${product.price}</p>
              <button onClick={() => addToCart(product)} className="btn btn-primary">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Login({ onLogin }) {
  const [username, setUsername] = useState('user');
  const [password, setPassword] = useState('password');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (res.ok) {
        const data = await res.json();
        onLogin(data);
        navigate('/');
      } else {
        alert('Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Login error');
    }
  };

  return (
    <div className="container">
      <div className="auth-container">
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (res.ok) {
        alert('Registration successful! Please login.');
        navigate('/login');
      } else {
        alert('Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('Registration error');
    }
  };

  return (
    <div className="container">
      <div className="auth-container">
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '' });

  const fetchProducts = () => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing 
      ? `${API_URL}/admin/products/${isEditing}`
      : `${API_URL}/admin/products`;
    
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchProducts();
        setFormData({ name: '', price: '' });
        setIsEditing(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await fetch(`${API_URL}/admin/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (product) => {
    setIsEditing(product.id);
    setFormData({ name: product.name, price: product.price });
  };

  return (
    <div className="container">
      <h1 style={{ marginTop: '2rem', marginBottom: '2rem' }}>Admin Dashboard</h1>
      
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label">Product Name</label>
            <input 
              className="form-input"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group" style={{ width: '150px', marginBottom: 0 }}>
            <label className="form-label">Price</label>
            <input 
              type="number"
              step="0.01"
              className="form-input"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>
            {isEditing ? 'Update' : 'Add'}
          </button>
          {isEditing && (
            <button 
              type="button" 
              className="btn btn-outline" 
              style={{ width: 'auto' }}
              onClick={() => { setIsEditing(null); setFormData({ name: '', price: '' }); }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Price</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem' }}>{product.id}</td>
                <td style={{ padding: '1rem' }}>{product.name}</td>
                <td style={{ padding: '1rem' }}>${product.price}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button 
                    onClick={() => startEdit(product)}
                    style={{ background: 'none', color: 'var(--primary)', marginRight: '1rem' }}
                  >
                    <Edit size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    style={{ background: 'none', color: 'var(--danger)' }}
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Cart({ cart, user, clearCart }) {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!user) return navigate('/login');
    
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.user_id,
          items: cart,
          total_amount: total
        }),
      });

      if (res.ok) {
        alert('Order placed successfully!');
        clearCart();
        navigate('/');
      } else {
        alert('Failed to place order');
      }
    } catch (err) {
      console.error(err);
      alert('Error placing order');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <ShoppingCart size={64} color="var(--text-light)" />
        <h2 style={{ marginTop: '1rem' }}>Your cart is empty</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem', width: 'auto' }}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="cart-container">
        <h2 style={{ marginBottom: '2rem' }}>Shopping Cart</h2>
        {cart.map((item, index) => (
          <div key={index} className="cart-item">
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{item.name}</h3>
              <p style={{ color: 'var(--text-light)' }}>Quantity: {item.quantity}</p>
            </div>
            <div style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
        <div className="cart-total">
          Total: ${total.toFixed(2)}
        </div>
        <button 
          onClick={handleCheckout}
          className="btn btn-primary" 
          style={{ marginTop: '2rem', marginLeft: 'auto', display: 'block', width: 'auto' }}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

// --- Main App ---

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const clearCart = () => setCart([]);

  return (
    <Router>
      <div className="app">
        <Navbar user={user} onLogout={() => setUser(null)} cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} />
        <Routes>
          <Route path="/" element={<ProductList addToCart={addToCart} />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart cart={cart} user={user} clearCart={clearCart} />} />
          {user && user.role === 'admin' && (
            <Route path="/admin" element={<AdminPanel />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
