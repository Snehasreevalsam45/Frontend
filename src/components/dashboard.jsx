import React, { useState, useEffect } from 'react';

const Dashboard = ({ onLogout }) => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const API_BASE_URL = 'http://localhost:5000/api/products';

  // 1. VIEW PRODUCTS (GET)
  const fetchProducts = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      showMsg('error', 'Failed to fetch products from server');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // 2. ADD & UPDATE PRODUCT (POST & PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = { name, price: Number(price), description };
    const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const data = await response.json();

      if (data.success) {
        showMsg('success', editingId ? 'Product updated successfully!' : 'Product added successfully!');
        setName('');
        setPrice('');
        setDescription('');
        setEditingId(null);
        fetchProducts(); // Refresh list
      } else {
        showMsg('error', data.message || 'Something went wrong');
      }
    } catch (error) {
      showMsg('error', 'Server error. Please try again.');
    }
  };

  // 3. DELETE PRODUCT (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.success) {
          showMsg('success', 'Product deleted successfully');
          fetchProducts();
        }
      } catch (error) {
        showMsg('error', 'Failed to delete product');
      }
    }
  };

  // Trigger Edit Mode
  const handleEditClick = (product) => {
    setEditingId(product._id);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
  };

  return (
    <div style={styles.dashboardContainer}>
      {/* Top Header/Navbar */}
      <header style={styles.header}>
        <div style={styles.logoArea}>
          <span style={styles.logoIcon}>🍃</span>
          <h1 style={styles.headerTitle}>GreenStock Dashboard</h1>
        </div>
        <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
      </header>

      {/* Alert Messages */}
      {message.text && (
        <div style={message.type === 'success' ? styles.successAlert : styles.errorAlert}>
          {message.text}
        </div>
      )}

      <div style={styles.mainContent}>
        {/* Left Side: Product Form (Add/Edit) */}
        <div style={styles.formSection}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>{editingId ? '⚡ Edit Product' : '➕ Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Product Name</label>
                <input type="text" placeholder="e.g. Organic Green Tea" value={name} onChange={(e) => setName(e.target.value)} required style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Price (₹)</label>
                <input type="number" placeholder="e.g. 299" value={price} onChange={(e) => setPrice(e.target.value)} required style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Description</label>
                <textarea placeholder="Write something about the product..." value={description} onChange={(e) => setDescription(e.target.value)} required style={styles.textarea} />
              </div>
              <button type="submit" style={styles.submitBtn}>
                {editingId ? 'Save Changes' : 'Publish Product'}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setName(''); setPrice(''); setDescription(''); }} style={styles.cancelBtn}>
                  Cancel Edit
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Right Side: Product Inventory List */}
        <div style={styles.inventorySection}>
          <h2 style={styles.sectionTitle}>Current Inventory ({products.length})</h2>
          {products.length === 0 ? (
            <div style={styles.noProducts}>No products available. Start adding some!</div>
          ) : (
            <div style={styles.productGrid}>
              {products.map((product) => (
                <div key={product._id} style={styles.productCard}>
                  <div style={styles.productInfo}>
                    <h3 style={styles.prodName}>{product.name}</h3>
                    <div style={styles.prodPrice}>₹{product.price}</div>
                    <p style={styles.prodDesc}>{product.description}</p>
                  </div>
                  <div style={styles.cardActions}>
                    <button onClick={() => handleEditClick(product)} style={styles.editBtn}>Edit</button>
                    <button onClick={() => handleDelete(product._id)} style={styles.deleteBtn}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  dashboardContainer: { minHeight: '100vh', backgroundColor: '#f0fdf4', fontFamily: '"Segoe UI", sans-serif', padding: '0 0 40px 0' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#059669', padding: '15px 40px', boxShadow: '0 4px 12px rgba(4, 120, 87, 0.15)' },
  logoArea: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { fontSize: '28px' },
  headerTitle: { color: 'white', margin: 0, fontSize: '22px', fontWeight: '600' },
  logoutBtn: { backgroundColor: '#ffffff', color: '#dc2626', border: '1px solid #fca5a5', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: '0.2s' },
  mainContent: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', padding: '40px', maxWidth: '1300px', margin: '0 auto', boxSizing: 'border-box' },
  formSection: { position: 'sticky', top: '40px' },
  card: { backgroundColor: '#ffffff', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.08)', border: '1px solid #d1fae5' },
  cardTitle: { margin: '0 0 20px 0', color: '#064e3b', fontSize: '20px' },
  inputGroup: { marginBottom: '18px' },
  label: { display: 'block', fontSize: '12px', color: '#065f46', marginBottom: '6px', fontWeight: 'bold', textTransform: 'uppercase' },
  input: { width: '100%', padding: '12px', border: '1px solid #a7f3d0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#f0fdf4' },
  textarea: { width: '100%', padding: '12px', border: '1px solid #a7f3d0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#f0fdf4', height: '100px', resize: 'vertical' },
  submitBtn: { width: '100%', padding: '12px', color: 'white', backgroundColor: '#059669', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.2)' },
  cancelBtn: { width: '100%', padding: '10px', color: '#475569', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },
  inventorySection: { backgroundColor: '#ffffff', padding: '35px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.05)', border: '1px solid #d1fae5', minHeight: '500px' },
  sectionTitle: { margin: '0 0 25px 0', color: '#064e3b', fontSize: '22px' },
  noProducts: { textAlign: 'center', color: '#94a3b8', marginTop: '80px', fontSize: '16px' },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' },
  productCard: { backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s' },
  productInfo: { marginBottom: '15px' },
  prodName: { margin: '0 0 8px 0', color: '#064e3b', fontSize: '18px' },
  prodPrice: { fontSize: '20px', fontWeight: 'bold', color: '#16a34a', marginBottom: '10px' },
  prodDesc: { fontSize: '13px', color: '#475569', margin: 0, lineHeight: '1.5' },
  cardActions: { display: 'flex', gap: '10px', marginTop: 'auto' },
  editBtn: { flex: 1, padding: '8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  deleteBtn: { flex: 1, padding: '8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  successAlert: { backgroundColor: '#d1fae5', color: '#065f46', padding: '12px 30px', margin: '20px auto 0 auto', maxWidth: '1220px', borderRadius: '8px', textAlign: 'center', fontWeight: '500', border: '1px solid #a7f3d0' },
  errorAlert: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px 30px', margin: '20px auto 0 auto', maxWidth: '1220px', borderRadius: '8px', textAlign: 'center', fontWeight: '500', border: '1px solid #fca5a5' }
};

export default Dashboard;