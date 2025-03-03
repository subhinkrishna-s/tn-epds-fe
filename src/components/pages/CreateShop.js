import React, { useContext, useState } from 'react';
import { DContext } from '../../context/Datacontext';

const CreateShop = () => {

  const {BeURL} = useContext(DContext)

  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [items, setItems] = useState([
    { product: '', quantity: "", price: "" }
  ]);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const allowedProducts = ["wheat", "sugar", "oil"];

  // Handle dynamic item changes
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = name === 'quantity' || name === 'price' ? Number(value) : value;
    setItems(newItems);
  };

  // Check if there is any product left that hasn't been selected
  const canAddMoreItems = () => {
    const selectedProducts = items.map(item => item.product).filter(prod => prod);
    return allowedProducts.some(prod => !selectedProducts.includes(prod));
  };

  const addItem = () => {
    if (canAddMoreItems()) {
      setItems([...items, { product: '', quantity: 0, price: 0 }]);
    } else {
      alert("All available products have been added.");
    }
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();

    // Validate required fields
    if (!shopName.trim() || !address.trim() || !fullname.trim() || !email.trim() || !contact.trim() || !password.trim()) {
      setMessage("Please fill out all required fields.");
      return;
    }
    
    // Validate that at least one item is added
    if (items.length === 0) {
      setMessage("Please add at least one product.");
      return;
    }
    
    // Validate each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.product) {
        setMessage(`Please select a product for item ${i + 1}.`);
        return;
      }
      if (item.quantity === "" || isNaN(item.quantity) || item.quantity < 0) {
        setMessage(`Please provide a valid quantity for item ${i + 1}.`);
        return;
      }
    }
    
    setLoading(true);
    setMessage('');
    
    
    const payload = { shopName, address, items, fullname, email, contact, password };

    try {
      const res = await fetch(`${BeURL}/create-shop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Shop created successfully!");
        window.location.href="/shops"
      } else {
        setMessage(data.message || "Failed to create shop!");
      }
    } catch (err) {
      console.error("Error in creating shop:", err);
      setMessage("Trouble in connecting to the Server, please try again later.");
    }
    setLoading(false);
  };

  // Get available options for a given item index by filtering out already selected products (except for current selection)
  const getAvailableOptions = (currentIndex) => {
    const selectedProducts = items
      .filter((_, i) => i !== currentIndex)
      .map(item => item.product)
      .filter(prod => prod);
    return allowedProducts.filter(prod => !selectedProducts.includes(prod));
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Create Shop</h2>
      {message && <div className="alert alert-info text-center">{message}</div>}
      <form onSubmit={handleSubmit} className="shadow p-4 rounded">
        <div className="row">
          {/* Shop Details */}
          <div className="col-md-6">
            <h4>Shop Details</h4>
            <div className="form-group mb-3">
              <label htmlFor="shopName">Shop Name</label>
              <input
                type="text"
                id="shopName"
                className="form-control"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                className="form-control"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Admin Details */}
          <div className="col-md-6">
            <h4>Admin Details</h4>
            <div className="form-group mb-3">
              <label htmlFor="fullname">Full Name</label>
              <input
                type="text"
                id="fullname"
                className="form-control"
                value={fullname}
                onChange={e => setFullname(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="contact">Contact (10-digit)</label>
              <input
                type="text"
                id="contact"
                className="form-control"
                value={contact}
                onChange={e => setContact(e.target.value)}
                required
                pattern="\d{10}"
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Items Details */}
        <div className="mt-4">
          <h4>Items</h4>
          {items.map((item, index) => (
            <div key={index} className="border rounded p-3 mb-3">
              <div className="row">
                <div className="col-md-4">
                  <label>Product</label>
                  <select
                    name="product"
                    className="form-control"
                    value={item.product}
                    onChange={e => handleItemChange(index, e)}
                    required
                  >
                    <option value="">Select</option>
                    {getAvailableOptions(index).map((prod, idx) => (
                      <option key={idx} value={prod}>
                        {prod.charAt(0).toUpperCase() + prod.slice(1)}
                      </option>
                    ))}
                    {item.product && !getAvailableOptions(index).includes(item.product) && (
                      <option value={item.product}>
                        {item.product.charAt(0).toUpperCase() + item.product.slice(1)}
                      </option>
                    )}
                  </select>
                </div>
                <div className="col-md-3">
                  <label>Quantity</label>
                  <input
                    type="tel"
                    name="quantity"
                    className="form-control"
                    value={item.quantity}
                    onChange={e => handleItemChange(index, e)}
                    min="0"
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label>Price</label>
                  <input
                    type="tel"
                    name="price"
                    className="form-control"
                    value={item.price}
                    onChange={e => handleItemChange(index, e)}
                    min="0"
                  />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  {items.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger w-100"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="text-end">
            <button type="button" className="btn btn-secondary" onClick={addItem}>
              Add Item
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button type="submit" className="btn btn-primary px-4" disabled={loading}>
            {loading ? "Creating Shop..." : "Create Shop"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateShop;
