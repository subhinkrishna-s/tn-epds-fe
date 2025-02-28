import React from 'react'
import ShopImg from '../../assets/add-to-cart.svg'
import UserImg from '../../assets/personal-info.svg'

function SuperAdminDashboard() {

    const Cards = [
        {
            img: ShopImg,
            title: "Shops",
            path: "/shops"
        },
        {
            img: UserImg,
            title: "Customers",
            path: "/customers"
        }
    ]

  return (
    <div className='bg-light py-5' style={{minHeight: '80vh'}}>
        <h2 className='my-3 mb-5 text-primary text-center'>Super Admin Dashboard</h2>
        <div className='d-flex flex-wrap justify-content-center align-items-center gap-2'>
        {
            Cards.map((card, i)=>(
                <div className='col-11 col-sm-10 col-md-5 col-lg-3 border rounded text-center p-2 bg-white' style={{filter: 'drop-shadow(0 0 4px rgb(199, 211, 194))'}}>
                    <img className='w-100' src={card.img} alt={card.title} style={{height: '250px'}} />
                    <h3 className='my-2'>{card.title}</h3>
                    <button className='btn btn-primary' onClick={()=>window.location.href=card.path}>View</button>
                </div>
            ))
        }
        </div>
    </div>
  )
}

export default SuperAdminDashboard