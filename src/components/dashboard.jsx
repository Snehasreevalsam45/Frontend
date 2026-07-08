import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:5000/api/products";

  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // Token & Role
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const isAdmin = role === "admin";

  // Check Login
  useEffect(() => {
    if (!token) {
      alert("Please login first.");
      navigate("/login");
    }
  }, [token, navigate]);

  // Load Products
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await fetch(API_BASE_URL);

      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      } else {
        showMessage("error", data.message);
      }
    } catch (error) {
      console.log(error);
      showMessage("error", "Unable to load products.");
    }
  };

  // Show Alert
  const showMessage = (type, text) => {
    setMessage({ type, text });

    setTimeout(() => {
      setMessage({
        type: "",
        text: "",
      });
    }, 3000);
  };

  // Add / Update Product
  const handleSubmit = async (e) => {
    e.preventDefault();

    const product = {
      name,
      price: Number(price),
      description,
    };

    const url = editingId
      ? `${API_BASE_URL}/${editingId}`
      : API_BASE_URL;

    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      const data = await response.json();

      if (data.success) {
        showMessage(
          "success",
          editingId
            ? "Product Updated Successfully"
            : "Product Added Successfully"
        );

        setName("");
        setPrice("");
        setDescription("");
        setEditingId(null);

        fetchProducts();
      } else {
        showMessage("error", data.message);
      }
    } catch (error) {
      console.log(error);
      showMessage("error", "Server Error");
    }
  };

  // Delete Product
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        showMessage("success", "Product Deleted Successfully");
        fetchProducts();
      } else {
        showMessage("error", data.message);
      }
    } catch (error) {
      console.log(error);
      showMessage("error", "Unable to delete product.");
    }
  };

  // Edit Product
  const handleEdit = (product) => {
    setEditingId(product._id);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>GreenStock Dashboard</h1>

        <button
          style={styles.logoutBtn}
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      {message.text && (
        <div
          style={
            message.type === "success"
              ? styles.successMsg
              : styles.errorMsg
          }
        >
          {message.text}
        </div>
      )}

      <div
        style={{
          ...styles.main,
          gridTemplateColumns: isAdmin ? "1fr 2fr" : "1fr",
        }}
      >
        {isAdmin && (
          <div style={styles.formContainer}>
            <h2>
              {editingId
                ? "Edit Product"
                : "Add Product"}
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
                style={styles.input}
              />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                required
                style={styles.input}
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                required
                style={styles.textarea}
              />

              <button
                type="submit"
                style={styles.submitBtn}
              >
                {editingId
                  ? "Update Product"
                  : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={() => {
                    setEditingId(null);
                    setName("");
                    setPrice("");
                    setDescription("");
                  }}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>
        )}

        <div style={styles.productContainer}>
          <h2>Products ({products.length})</h2>

          {products.length === 0 ? (
            <p>No Products Found.</p>
          ) : (
            <div style={styles.grid}>
              {products.map((product) => (
                <div
                  key={product._id}
                  style={styles.card}
                >
                  <h3>{product.name}</h3>

                  <h4>₹ {product.price}</h4>

                  <p>{product.description}</p>

                  {isAdmin && (
                    <div style={styles.buttonGroup}>
                      <button
                        style={styles.editBtn}
                        onClick={() =>
                          handleEdit(product)
                        }
                      >
                        Edit
                      </button>

                      <button
                        style={styles.deleteBtn}
                        onClick={() =>
                          handleDelete(product._id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; // <--- ഈ ബ്രാക്കറ്റാണ് നിങ്ങളുടെ പഴയ കോഡിൽ വിട്ടുപോയിരുന്നത്!

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f0fdf4",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  logoutBtn: {
    padding: "10px 20px",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
  },

  successMsg: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
  },

  errorMsg: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
  },

  main: {
    display: "grid",
    gap: "30px",
  },

  formContainer: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    height: "fit-content",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    resize: "none",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  submitBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#059669",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "10px",
  },

  cancelBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#6b7280",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },

  productContainer: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
    gap: "20px",
  },

  card: {
    backgroundColor: "#ecfdf5",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #a7f3d0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },

  editBtn: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  deleteBtn: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Dashboard;