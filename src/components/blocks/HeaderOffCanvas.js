import React, { useContext, useEffect, useState } from 'react'
import * as bootstrap from 'bootstrap'
import { useNavigate } from 'react-router-dom'
import { DContext } from '../../context/Datacontext'

function HeaderOffcanvas() {

    const {isAuth, handleLogout, currentUser} = useContext(DContext)
    const navPage = useNavigate()

    const [navItems, setNavItems] = useState([
        {
            label: "Home",
            path: "/",
            icon: "bi bi-house"
        }
    ])

    useEffect(()=>{
        if(currentUser){
            if(currentUser.role==="superadmin"){
                setNavItems([
                    {
                        label: "Home",
                        path: "/"
                    },
                    {
                        label: "Shops",
                        path: "/shops"
                    },
                    {
                        label: "Purchases",
                        path: "/purchases"
                    },
                    {
                        label: "Alerts",
                        path: "/alerts"
                    }
                ])
            }
            else if(currentUser.role==="admin"){
                setNavItems([
                    {
                        label: "Home",
                        path: "/"
                    },
                    {
                        label: "Create User",
                        path: "/create-user"
                    },
                    {
                        label: "Purchases",
                        path: "/purchases"
                    }
                ])
            }
        }
    }, [currentUser])

    // [
    //     { label: "Home", path: "/", icon: "bi bi-house" },
    //     { label: "About Us", path: "/about-us", icon: "bi bi-info-circle" },
    //     { label: "Services", path: "/services", icon: "bi bi-gear" },
    //     { label: "Products", path: "/products", icon: "bi bi-box" },
    //     { label: "Projects", path: "/projects", icon: "bi bi-folder" },
    //     { label: "Terms & Condition", path: "/terms-condition", icon: "bi bi-file-earmark-text" },
    //     { label: "Privacy & Policy", path: "/privacy-policy", icon: "bi bi-shield-lock" }
    // ];


    const handleNavCollapse = (path) => {
        const offcanvasElement = document.getElementById('offcanvasExample');
        const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement); // Get the existing instance
        if (offcanvas) {
            offcanvas.hide();
        }

        const backdrop = document.querySelector('.offcanvas-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        navPage(path)
    };

    return (
        <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel" data-bs-backdrop="static" data-bs-scroll="true">
            <div className="offcanvas-header">
                <div className='d-flex justify-content-start align-items-center gap-2 logo-container' id="offcanvasExampleLabel" role='button' onClick={() => handleNavCollapse('/')}>
                    {/* <img src='https://dummyimage.com/512x512/ddd/000.png&text=Logo' alt='Logo' style={{height: "60px"}}/> */}
                    <div className='text-primary text-center'>
                        <h1 className='m-0 fs-3 fw-bold'>ePDS</h1>
                    </div>
                </div>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <nav>
                    <ul className='fs-5 m-0 p-0' style={{ listStyleType: 'none' }}>
                        {
                            navItems.map((item, index) => (
                                <li key={index} className="p-2 my-1" role="button" onClick={() => handleNavCollapse(item.path)}>
                                    {/* <i className={item.icon} style={{ marginRight: "8px" }}></i> */}
                                    {item.label}
                                </li>
                            ))
                        }
                        {
                            isAuth!==null && (
                                isAuth?
                                <li className='my-1 btn btn-primary w-100 px-4 fs-5' role='button' onClick={handleLogout}>Logout</li>
                                :<li className='my-1 btn btn-primary w-100 px-4 fs-5' role='button' onClick={() => window.location.href = '/login'}>Login</li>
                            )
                        }
                        
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default HeaderOffcanvas