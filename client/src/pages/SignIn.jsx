import { useState } from 'react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {Link,useNavigate} from 'react-router-dom'
import { signInStart,signInFailure,signInSuccess } from '../redux/user/userslice';
import OAuth from '../components/oAuth';



export default function SignIn() {
  const [FormData,setFormData]=useState({});
  const {loading,error}=useSelector((state)=>state.user);
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const handleOnChange = (e)=>{
        setFormData({
          ...FormData,
          [e.target.id]:e.target.value
        });
  };

const onSubmitHandler=async (e)=>{
  e.preventDefault();
  try{
  dispatch(signInStart());
  const res=await fetch("/api/auth/signin",{
     method:'POST',
     headers:{
      'Content-Type':'application/json',
     },
     body:JSON.stringify(FormData),
  });
  const data=await res.json();
  if(data.success===false)
  {
    dispatch(signInFailure(data.message));
    return;
  }
dispatch(signInSuccess(data));
  navigate('/')
}catch(err){
  dispatch(signInFailure(err.message));
}
  console.log(data);
};


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={onSubmitHandler}>
         <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleOnChange}/>
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleOnChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
          {loading ? 'loading...':'SignIn'}</button>
          <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont Have an account?</p>
        <Link to={"/sign-up"}>
        <span className='text-blue-700'>Sign-Up</span>
        </Link>

      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
