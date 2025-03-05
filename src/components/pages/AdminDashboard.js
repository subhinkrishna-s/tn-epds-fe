import React, { useContext, useEffect, useState } from 'react'
import { DContext } from '../../context/Datacontext'
import Loading from '../pages/Loading'

function AdminDashboard() {

    const { BeURL, isAuth } = useContext(DContext)

    const [shop, setShop] = useState(null)
    const [logistics, setLogistics] = useState(null)
    const [logisticsCount, setLogisticsCount] = useState(null)

    const [acknowledgement, setAcknowledgement] = useState(null)

    useEffect(() => {
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
                console.log("Erron in fetching Shops:",err)
                alert("Trouble in connecting to the Server, please try again later.")
            })

            fetch(`${BeURL}/fetch-logistics`, {
                credentials: "include"
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setLogistics(data.logistics)
                    if(data.logistics && data.logistics.length>0){
                        const count = data.logistics.filter(item => item.status!=='closed');
                        setLogisticsCount(count.length||0)
                    }
                    else{
                        setLogisticsCount(0)
                    }
                }
                else {
                    alert(data.message)
                }
            })
            .catch(err => {
                console.log("Erron in fetching Logistics:",err)
                alert("Trouble in connecting to the Server, please try again later.")
            })
        }
    }, [BeURL])


    const handleAcknowledgement = (id, status) => {

        let tempAcknowledgment;

        if(status===true){
            tempAcknowledgment = {
                id: id, status: status
            }
        }
        else{
            tempAcknowledgment = acknowledgement
        }

        if(!tempAcknowledgment) return;

        console.log("tempAcknowledgment:",tempAcknowledgment)

        fetch(`${BeURL}/logistics-acknowledgement`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Accept: "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ acknowledgement: tempAcknowledgment, id })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.success) {
                window.location.href="/"
            }
            else {
                alert(data.message)
            }
        })
        .catch(err => {
            console.log("Erron in acknowledgement:", err)
            alert("Trouble in connecting to the Server, please try again later.")
        })

    }


    if (!shop || !logistics || logisticsCount===null || isAuth===null) {
        return <Loading />
    }

    return (
        <div className='bg-light py-5' style={{ minHeight: '80vh' }}>
            <h2 className='my-3 mb-5 text-primary text-center'>Shop Dashboard</h2>
            
            <div className='text-center'>
                <button className='btn btn-primary m-2' onClick={()=>window.location.href="/create-user"}>Create User</button>
                <button className='btn btn-primary m-2' onClick={()=>window.location.href="/purchases"}>View Purchases</button>
            </div>

            <div className='text-center mx-auto col-11'>
                <h3>Product stocks</h3>
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
                        <p>No Products are available!</p>
                    )
                }
            </div>


            <div className='py-3'>
                <h3 className='text-center my-3'>Notifications <sup className='badge text-bg-success fs-6'>{logisticsCount || 0}</sup></h3>
                <div className='col-11 mx-auto'>
                    {
                        logistics && logistics.length > 0 && logisticsCount>0 ?
                        logistics.map((item, i) => {
                            if(item.status!=="closed"){
                                return(
                                    <div className='border-start border-5 p-3 m-2 border-primary' style={{ background: "#f3f3f3" }}>
                                <div className='d-flex justify-content-between align-items-center gap-2'>
                                    <p className='m-0'><b>{item.quantity}kg</b> of <b>{item.product}</b> has been sent</p>
                                    <div className='d-flex flex-wrap justify-content-end align-items-center gap-2'>
                                        <button className='btn btn-success p-0 px-1' onClick={() => { setAcknowledgement({ id: item.id, status: true }); handleAcknowledgement(item.id, true) }}>Confirm <i className='bi bi-check'></i></button>
                                        <button className='btn btn-danger p-0 px-1' onClick={() => setAcknowledgement({ id: item.id, status: false })}>Report <i className='bi bi-x'></i></button>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-between align-items-center gap-2'>
                                    <p className='m-0'>Price: <b>{item.price}/kg</b></p>
                                    <span>{/*Created At: */}{new Date(item.createdAt).toLocaleString()}</span>
                                </div>
                                {acknowledgement && (acknowledgement.id === item.id && acknowledgement.status === false) &&
                                    <div className='my-2 bg-light rounded p-2'>
                                        <div className='d-flex justify-content-center align-items-center gap-3'>
                                            <p className='m-0'>Haven you received the Product?</p>
                                            <div className='d-flex justify-content-center align-items-center gap-3'>
                                                <span className='d-flex justify-content-center align-items-center gap-1'>
                                                    <label htmlFor={`Yes-${item.id}`}>Yes</label>
                                                    <input onChange={(e) => setAcknowledgement({ ...acknowledgement, isReceived: e.target.value === "true" })} className='mt-1' name={item.id} id={`Yes-${item.id}`} value={"true"} type='radio' />
                                                </span>
                                                <span className='d-flex justify-content-center align-items-center gap-1'>
                                                    <label htmlFor={`No-${item.id}`}>No</label>
                                                    <input onChange={(e) => setAcknowledgement({ ...acknowledgement, isReceived: e.target.value === "true" })} className='mt-1' name={item.id} id={`No-${item.id}`} value={"false"} type='radio' />
                                                </span>
                                            </div>
                                        </div>
                                        {acknowledgement && acknowledgement.isReceived === true &&
                                            <div className='my-2 d-flex justify-content-center align-items-center gap-2'>
                                                <p className='m-0'>How much quantity is received? </p>
                                                <div>
                                                    <input
                                                        onChange={(e) => setAcknowledgement({ ...acknowledgement, quantity: e.target.value })}
                                                        value={(acknowledgement && acknowledgement.quantity) || ""}
                                                        className={`mx-auto form-control ${acknowledgement && acknowledgement.quantity === "" ? "is-invalid" : ""}`}
                                                        type='tel' style={{ width: '100px' }}
                                                    />
                                                    {acknowledgement && acknowledgement.quantity === "" &&
                                                        <div className="invalid-feedback">Please enter quantity received.</div>
                                                    }
                                                </div>
                                            </div>}
                                        <div className='text-center'>
                                            <button className='btn btn-outline-info m-2' onClick={() => setAcknowledgement(null)}>Cancel</button>
                                            <button className='btn btn-info m-2' onClick={() => handleAcknowledgement(item.id)} disabled={acknowledgement && acknowledgement.quantity === ""}>Raise Report</button>
                                        </div>
                                    </div>}
                            </div>
                                )
                            }
                        })
                        : (
                            <p className='my-3 text-center'>No Alerts available!</p>
                        )
                    }
                </div>
            </div>

        </div>
    )
}

export default AdminDashboard