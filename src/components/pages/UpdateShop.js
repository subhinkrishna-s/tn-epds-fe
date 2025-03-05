import React, { useContext, useEffect, useState } from 'react';
import { DContext } from '../../context/Datacontext';
import { useParams } from 'react-router-dom';
import LoadingPage from './Loading';

const UpdateShop = () => {

    const { BeURL } = useContext(DContext)
    const { id } = useParams()

    const [shop, setShop] = useState(null)
    const [items, setItems] = useState([
        { product: '', quantity: "", price: "" }
    ]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');


    useEffect(() => {
        if (id) {
            fetch(`${BeURL}/fetch-shop/${id}`, {
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setShop(data.shop)
                    }
                    else {
                        alert(data.message)
                    }
                })
                .catch(err => {
                    console.log("Erron in Logout:", err)
                    alert("Trouble in connecting to the Server, please try again later.")
                })
        }
    }, [id])

    const allowedProducts = ["rice", "wheat", "kerosene"];

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
            const lastItem = items[items.length - 1];
            if (!lastItem.product || lastItem.quantity === "" || lastItem.price === "") {
                alert("Please fill out the current item completely before adding a new one.");
                return;
            }
            setItems([...items, { product: '', quantity: "", price: "" }]);
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
        if (!shop) {
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
            if (item.price === "" || isNaN(item.price) || item.price < 0) {
                setMessage(`Please provide a valid price for item ${i + 1}.`);
                return;
            }
        }

        setLoading(true);
        setMessage('');

        const consolidatedItems = items.filter(item=>{
            if(item.product!=="" && item.quantity!=="" && item.price!==""){
                return
            }
        })

        console.log(consolidatedItems)

        fetch(`${BeURL}/update-product/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ items })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setMessage("Products updated successfully!");
                window.location.href = "/shops"
            } else {
                setMessage(data.message || "Failed to create shop!");
            }
        })
        .catch(err => {
            console.error("Error in product updation:", err);
            setMessage("Trouble in connecting to the Server, please try again later.");
        })
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

    if (!shop || !id) {
        return <LoadingPage />
    }

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4 text-primary">Shop Details</h2>
            {message && <div className="alert alert-info text-center">{message}</div>}
            <form onSubmit={handleSubmit} className="shadow p-4 rounded">
                <div className="row">
                    {/* Shop Details */}
                    <div className="col-md-6 mx-auto ">
                        <h4>Shop Details</h4>
                        <div>
                            <p><b>Shop Id:</b> {shop.shopId}</p>
                            <p><b>Created At:</b> {shop.createdAt}</p>
                            <p><b>Shop Name:</b> {shop.shopName}</p>
                            <p><b>Address:</b> {shop.address}</p>
                            <h3 className='mt-3 text-center fs-5'>Available Products</h3>
                            <div className='table-responsive'>
                                <table className='table'>
                                    <thead>
                                        <tr>
                                            <th className='bg-primary'>S. No.</th>
                                            <th className='bg-primary'>Product</th>
                                            <th className='bg-primary'>Quantity</th>
                                            <th className='bg-primary'>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shop.items && shop.items.length > 0 ?
                                            shop.items.map((item, i) => (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>{item.product}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.price}</td>
                                                </tr>
                                            ))
                                            : <tr>
                                                <td colSpan={4} className='text-center'>No Products Available!</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                            
                        </div>
                    </div>

                </div>

                {/* Items Details */}
                <div className="mt-4">
                    <h4 className='text-center fs-5'>Add Items</h4>
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
                            Add field
                        </button>
                    </div>
                    
                    <div className="mt-4 text-center">
                        <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                            {loading ? "Updating Product..." : "Update Product"}
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default UpdateShop;
