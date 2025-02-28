import React, {useContext, useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { DContext } from '../../context/Datacontext'

function Header() {

    const location = useLocation()
    const navPage = useNavigate()

    const [currentPath, setCurrentPath] = React.useState(location.pathname)
    const {isAuth, handleLogout} = useContext(DContext)

    useEffect(()=>{
        setCurrentPath(location.pathname)
    })

    const menuItems = [
        {
            title: "Home",
            path: "/"
        },
        {
            title: "services",
            path: "/services"
        },
        {
            title: "about",
            path: "/about-us"
        }
    ]

  return (
    <header className='px-3 py-2 d-flex justify-content-between align-items-center gap-3'>
        <div className='d-flex justify-content-start align-items-center gap-2 logo-container' role='button' onClick={()=>window.location.href="/"}>
            {/* <img src={'https://dummyimage.com/512x512/ddd/000.png&text=Logo'} alt='Logo' style={{height: "60px"}}/> */}
            <h1 className='m-0 fs-3 fw-bold text-primary'>ePDS</h1>
        </div>
        <nav className='lg-menu'>
            <ul className='d-flex justify-content-center align-items-center m-0 p-0' style={{listStyleType: 'none'}}>
                {
                    menuItems.map((menu, i)=>(
                        <li key={i} className={`${currentPath===menu.path?'text-white bg-primary':'text-secondary'} px-2 py-1 rounded-pill`} style={{width: 'max-content'}} role='button' onClick={()=>navPage(menu.path)}>{menu.title}</li>
                    ))
                }
            </ul>
        </nav>
        {isAuth!==null && <div className='text-end lg-menu cta-container'>
            {
                isAuth?
                <button className='btn btn-primary rounded-pill' onClick={handleLogout}>Logout</button>
                :<button className='btn btn-primary rounded-pill' onClick={()=>navPage('/login')}>Login</button>
            }
        </div>}
        <i className='bi bi-list fs-1 sm-menu' data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample"></i>
    </header>
  )
}

export default Header