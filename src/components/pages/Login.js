import React, {useState, useContext} from 'react'
import { DContext } from '../../context/Datacontext'
import LoginImg from '../../assets/Login.svg'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const {setIsAuth, setCurrentUser, BeURL} = useContext(DContext)
    const navPage = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const HandleLogin = async (e)=> {

        e.preventDefault()

        if(email!=="" && password!==""){
            fetch(`${BeURL}/login`, {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials: "include",
                body:JSON.stringify({
                    email, password
                })
            })
            .then(res=>res.json())
            .then(data=>{
                if(data.success){
                    setIsAuth(true)
                    setCurrentUser(data.user)
                    navPage('/')
                }else{
                    alert(data.message)
                }
            })
            .catch(err=>{
                alert('Trouble in connecting to the Server! Please try again later.')
                console.log('Error in Login:',err)
            })
        }
        else{
            alert("All fields are required!")
        }
   
    }


  return (
    <div className='d-flex flex-wrap justify-content-center align-items-center' style={{minHeight: '85vh'}}>
        <div className='text-center p-3 rounded-start'>
            <img src={LoginImg} alt='pandavas-signin' style={{height: '150px'}} />
            <h1 className='display-3 text-primary'>Welcome Back!</h1>
            <p className='lead'><small>Enter your registered Email and Password for accesing your user account.</small></p>
        </div>
        <div className='bg-light text-dark m-3 p-5 col-md-5 rounded border border-primary'>
            <h2 className='text-center text-primary'>Login</h2>
            <p>Don't have an account? then <a className='text-info' href='/register'>Click here</a></p>
            <form>
            <div className="mb-3">
                <label htmlFor="InputEmail" className="form-label">Email address</label>
                <input value={email} onChange={(e)=>{setEmail(e.target.value)}} required type="email" className="form-control" id="InputEmail" placeholder="name@mail.com"/>
            </div>
            <div className="mb-3">
                <label htmlFor="InputPassword" className="form-label">Password</label>
                <input value={password} onChange={(e)=>{setPassword(e.target.value)}} required type="password" className="form-control" id="InputPassword" placeholder="••••••••"/>
            </div>
            <div className='d-flex justify-content-center'>
                <button onClick={HandleLogin} type='submit' className='btn btn-primary'>Login <i className='bi bi-box-arrow-in-right'></i></button>
            </div>
            </form>
        </div>
    </div>
  )
}

export default Login