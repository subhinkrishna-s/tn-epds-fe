import React, { useContext, useEffect, useState } from 'react'
import { DContext } from '../../context/Datacontext'
import Loading from '../pages/Loading'

function Home() {

    const { BeURL } = useContext(DContext)

    const [shop, setShop] = useState(null)

    const [orders, setOrders] = useState(null)


    useEffect(() => {

      const fetchData = () => {
        if (BeURL) {
          fetch(`${BeURL}/fetch-shop`, {
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
              console.log("Erron in fetching Shops:", err)
              alert("Trouble in connecting to the Server, please try again later.")
          })

          fetch(`${BeURL}/user-orders`, {
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

      return ()=>clearInterval(Interval)


    }, [BeURL])

    console.log(orders)


    if (!shop || !orders) {
        return <Loading />
    }

    return (
        <div className='bg-light py-5' style={{ minHeight: '80vh' }}>
            <h2 className='my-3 mb-5 text-primary text-center'>Customer Dashboard</h2>

            <div className='text-center mx-auto col-11'>
                <h3>Product stocks</h3>
                <span className='my-3'><b>Shop Id:</b> {shop.shopId.toUpperCase()}</span>
                {
                    (shop.items && shop.items.length > 0) ? (
                        <div className='d-flex flex-wrap justify-content-center align-items-stretch gap-2'>
                            {
                                ["rice", "wheat", "kerosene"].map((product, i)=>(
                                    <div className='col-10 col-sm-5 col-md-3 card p-3' key={i}>
                                        <h4 className='m-0 text-primary'>{product.toUpperCase()}</h4>
                                        <p className='m-0 my-2'>{shop.items.map(item=>{
                                            if(item.product===product){
                                                return item.quantity
                                            }
                                            else{
                                                return 0
                                            }
                                        }
                                        )} kg
                                        </p>
                                        <p className='m-0'>{shop.items.map(item=>{
                                            if(item.product===product){
                                                return `₹ ${item.price}/kg`
                                            }
                                            else{
                                                return "N/A"
                                            }
                                        }
                                        )}
                                        </p>
                                    </div>
                                ))
                            }
                        </div>
                    )
                    :
                    (
                        <p className='my-3'>No Products are available!</p>
                    )
                }
            </div>

          <div className='table-responsive col-11 mx-auto my-3 mt-5'>
            <h3 className='text-center'>Your Purchases</h3>
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
                  orders && orders.length>0?
                  orders.map((order, i)=>(
                    <tr key={i}>
                      <td>{i+1}</td>
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

        </div>
    )
}

export default Home