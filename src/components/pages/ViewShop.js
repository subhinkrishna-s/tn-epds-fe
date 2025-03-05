import React, { useContext, useEffect, useState } from 'react';
import { DContext } from '../../context/Datacontext';
import { useParams } from 'react-router-dom';
import LoadingPage from './Loading';

const ViewShop = () => {

    const { BeURL } = useContext(DContext)
    const { id } = useParams()

    const [shop, setShop] = useState(null)


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


    if (!shop || !id) {
        return <LoadingPage />
    }

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4 text-primary">Shop Details</h2>
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
        </div>
    );
};

export default ViewShop;
