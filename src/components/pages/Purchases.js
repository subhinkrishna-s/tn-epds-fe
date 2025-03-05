import React, { useContext, useEffect, useState } from 'react'
import { DContext } from '../../context/Datacontext'
import Loading from '../pages/Loading'

function Purchases() {

    const { BeURL } = useContext(DContext)

    const [orders, setOrders] = useState(null)


    useEffect(() => {

        const fetchData = () => {
            if (BeURL) {

                fetch(`${BeURL}/fetch-orders`, {
                    credentials: "include"
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setOrders(data.orders)
                    }
                    else {
                        alert(data.message)
                    }
                })
                .catch(err => {
                    console.log("Erron in fetching Shops:", err)
                    alert("Trouble in connecting to the Server, please try again later.")
                })
            }
        }

        const Interval = setInterval(fetchData, 5000)

        return () => clearInterval(Interval)


    }, [BeURL])


    if (!orders) {
        return <Loading />
    }

    return (
        <div className='table-responsive col-11 mx-auto my-3 mt-5'>
            <h3 className='text-center'>Purchases</h3>
            <table className='table'>
                <thead>
                    <tr>
                        <th>S.No.</th>
                        <th>Purchased At</th>
                        <th>Product</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orders && orders.length > 0 ?
                            orders.map((order, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                                    <td>{order.product}</td>
                                    <td>{order.quantity}</td>
                                </tr>
                            ))
                            :
                            <tr>
                                <td colSpan={4} className='text-center'>No Purchase are made yet!</td>
                            </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Purchases