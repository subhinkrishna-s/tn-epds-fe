import React from 'react'
import { useState, useContext } from 'react';
import { DContext } from '../../context/Datacontext';
import RegisterImg from '../../assets/agreement.svg'

const CreateUser = () => {

    const {setIsAuth, setCurrentUser, BeURL} = useContext(DContext)

    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [comparePassword, setComparePassword] = useState(true)

    const handleRegister = async () => {

        setComparePassword(password===confirmPassword)

        if(name!=="" || email!=="" || contact!=="" || password!==""){
            if(password===confirmPassword){
                fetch(`${BeURL}/create-user`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    credentials: "include",
                    body: JSON.stringify({ fullname: name, email, contact, password }),
                })
                .then(res=>res.json())
                .then(data=>{
                    alert(data.message)
                    if (data.success) {
                        window.location.href="/"
                    }
                })
                .catch(err=>{
                    alert('Trouble in connecting to the Server! Please try again later.')
                    console.log('Error in Register: '+err)
                })
        
            }else{
                alert('passwords not match!')
            }
        }
        else{
            alert("All fields are required!")
        }
 
    }


  return (
    <div className='d-flex flex-wrap justify-content-center align-items-center'>
        <div className='text-center p-2'>
            <img src={RegisterImg} alt='pandavas-register' style={{height: '150px'}} />
            <h1 className='display-3 text-primary my-0'>Create an Account!</h1>
            <p className='lead'><small>Enter all the required details for creating a new Account.</small></p>
        </div>
        <div className='text-dark bg-light m-3 p-5 col-md-5 rounded border border-primary'>
            <h2 className='text-center text-primary'>User Details</h2>
            <form>
            <div className="mb-3">
                <label htmlFor="InputName" className="form-label">Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required type="text" className="form-control" id="InputName" placeholder="Subhin Krishna"/>
            </div>
            <div className="mb-3">
                <label htmlFor="InputContact" className="form-label">Contact</label>
                <input value={contact} onChange={(e) => setContact(e.target.value)} required type="number" className="form-control" id="InputContact" placeholder="+91 9876543210"/>
            </div>
            <div className="mb-3">
                <label htmlFor="InputEmail" className="form-label">Email address</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" className="form-control" id="InputEmail" placeholder="name@example.com"/>
            </div>
            <div className="mb-3">
                <label htmlFor="InputPassword" className="form-label">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" className="form-control" id="InputPassword" placeholder="••••••••"/>
            </div>
            <div className="mb-3">
                <label htmlFor="InputConfirmPassword" className="form-label">Confirm Password</label>
                <input value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} type="password" className="form-control" id="InputConfirmPassword" required placeholder="••••••••"/>
            </div>
            <p className='my-2 ms-3 bagde bg-danger'>{comparePassword?'':'Passwords do not match'}</p>
            <div className='d-flex justify-content-center'>
                <button onClick={handleRegister} type='button' className='btn btn-primary'>Create <i className='bi bi-door-open'></i></button>
            </div>
            </form>
        </div>
    </div>
  )
}

export default CreateUser