import { useState } from 'react'
import React from 'react'
import {Link,useNavigate} from 'react-router-dom'
import OAuth from '../components/oAuth';

export default function SignUp() {
  const [FormData,setFormData]=useState({});
  const [error,setError]=useState();
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const handleOnChange = (e)=>{
        setFormData({
          ...FormData,
          [e.target.id]:e.target.value
        });
  };

const onSubmitHandler=async (e)=>{
  e.preventDefault();
  try{
  setLoading(true);
  const res=await fetch("/api/auth/signup",{
     method:'POST',
     headers:{
      'Content-Type':'application/json',
     },
     body:JSON.stringify(FormData),
  });
  const data=await res.json();
  if(data.success===false)
  {
    setError(data.message);
    setLoading(false);
    return;
  }
  setLoading(false);
  setError(null);
  navigate('/sign-in')
}catch(err){
  setLoading(false);
  setError(err.message);
}
  console.log(data);
};


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={onSubmitHandler}>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleOnChange}/>
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleOnChange}/>
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleOnChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
          {loading ? 'loading...':'SignUp'}</button>
          <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
        <span className='text-blue-700'>Sign-In</span>
        </Link>

      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
