import { Route, Routes } from 'react-router-dom';
import Header from './components/blocks/Header';
import './css/App.css';
import './css/main.css';
import Login from './components/pages/Login';
import HeaderOffcanvas from './components/blocks/HeaderOffCanvas';
import Register from './components/pages/Register';
import { useContext } from 'react';
import { DContext } from './context/Datacontext';
import LoadingPage from './components/pages/Loading';
import Home from './components/pages/Home';
import SuperAdminDashboard from './components/pages/SuperAdminDashboard';
import Shops from './components/pages/Shops';
import AccessDenied from './components/pages/AccessDenied';
import NotFound from './components/pages/NotFound';
import CreateShop from './components/pages/CreateShop';
import AdminDashboard from './components/pages/AdminDashboard';
import UpdateShop from './components/pages/UpdateShop';
import ViewShop from './components/pages/ViewShop';
import Alerts from './components/pages/Alerts';
import CreateUser from './components/pages/CreateUser';
import Purchases from './components/pages/Purchases';

function App() {

  const {isAuth, currentUser} = useContext(DContext)

  if(isAuth===null || !currentUser){
    return <LoadingPage/>
  }

  const renderHomepage = () => {
    if(isAuth){
      if(currentUser.role==="superadmin"){
        return <SuperAdminDashboard/>
      }
      else if(currentUser.role==="admin"){
        return <AdminDashboard/>
      }
      else{
        return <Home/>
      }
    }
    else{
      return <Login/>
    }
  }

  return (
    <div className="container-fluid p-0">
      <Header/>
      
      <Routes>
        <Route path="/" element={renderHomepage()} />
        <Route path="/login" element={isAuth?<Home/>:<Login/>} />
        <Route path='/register' element={isAuth?<Home/>:<Register/>} />

        <Route path='/shops' element={currentUser.role==="superadmin"?<Shops/>:<AccessDenied/>} />
        <Route path='/shop/:id' element={currentUser.role==="superadmin"?<ViewShop/>:<AccessDenied/>} />
        <Route path='/update-shop/:id' element={currentUser.role==="superadmin"?<UpdateShop/>:<AccessDenied/>} />
        <Route path='/create-shop' element={currentUser.role==="superadmin"?<CreateShop/>:<AccessDenied/>} />

        <Route path='/alerts' element={currentUser.role==="superadmin"?<Alerts/>:<AccessDenied/>} />
        <Route path='/purchases' element={(currentUser.role==="superadmin" || currentUser.role==="admin")?<Purchases/>:<AccessDenied/>} />

        <Route path='/create-user' element={(currentUser.role==="superadmin" || currentUser.role==="admin")?<CreateUser/>:<AccessDenied/>} />

        <Route path="*" element={<NotFound/>} />
      </Routes>

      <HeaderOffcanvas/>
    </div>
  );
}

export default App;
