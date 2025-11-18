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
