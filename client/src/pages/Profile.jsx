import React, { useEffect, useRef, useState } from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {getStorage, uploadBytesResumable,ref, getDownloadURL} from 'firebase/storage'

import { app } from '../firebase';
import { updateUserStart,updateUserFailure,updateUserSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess, signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userslice';
import {Link} from 'react-router-dom';

export default function Profile() {
  const dispatch=useDispatch();
  const fileRef=useRef(null);
  const [file,setFile]=useState(undefined);
  const [showError,setShowError]=useState(false);
  const {currentUser,loading,error}=useSelector((state)=>state.user);
  useEffect(()=>{
   if(file)
   {
    handleFileUpload(file);
   }
  },[file]);
  const [filePerc,setFilePerc]=useState(0);
  const [formData,setFormData]=useState({});
  const [userListings,setUserListings]=useState([]);
  console.log(filePerc);
  console.log(formData);

  const handleFileUpload=(file)=>{
    const storage=getStorage(app);
    const fileName=new Date().getTime()+file.name;
    const storageRef=ref(storage, fileName);
    const uploadTask=uploadBytesResumable(storageRef,file);

    uploadTask.on('state_changed',(snapshot)=>{
      const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
      setFilePerc(Math.round(progress));
    },(error)=>{
      console.log(error.message);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downLoadUrl)=>{
        setFormData({...formData,avatar:downLoadUrl})

      });
    }
    );
  };

  const handleOnChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
  }
  const handleSubmit=async (e)=>{
    e.preventDefault();
     try {
      dispatch(updateUserStart());
      const res=await fetch(`api/user/update/${currentUser._id}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
      });

      const data=await res.json();
      if(data.success===false)
      {
        dispatch(updateUserFailure(data.message));
        return ;
      }
      dispatch(updateUserSuccess(data));
      
     } catch (error) {
      dispatch(updateUserFailure(error.message));
     }
     

  }
  const handleDelete=async()=>{
    try {
      dispatch(deleteUserStart());
      const res=await fetch(`/api/user/delete/${currentUser._id}`,{
        method:"DELETE",
      });
      const data=await res.json();
      if(data.success===false)
      {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }

  }

  const handleSignOut=async ()=>{
  try {
    dispatch(signOutUserStart());
   const res=await fetch('/api/auth/signout');
   const data=await res.json();
   if(data.success===false)
   {
    dispatch(signOutUserFailure(data.message));
   }
   dispatch(signOutUserSuccess(data));
  } catch (error) {
    dispatch(signOutUserFailure(error.message));
  }
  }


  const handleShowListings =async ()=>{
    try {
      setShowError(false);
      const res=await fetch(`/api/user/listings/${currentUser._id}`);
      const data=await res.json();
      if(data.success===false)
      {
        setShowError(data.message);
        return;
      }
      setUserListings(data);
      console.log(data);
    } catch (error) {
      console.log(error.message);
      setShowError(error.message);
    }

  }

  const handleListingDelete=async (listing_id)=>{
   try {
    const res=await fetch( `/api/listing/delete/${listing_id}`,{
      method:'DELETE',
    });
    const data=await res.json();
    if(data.success===false)
    {
      console.log(data.message);
      return;
    }

    setUserListings((prev)=>prev.filter((listing)=>listing._id!=listing_id));
    
   } catch (error) {
    console.log(error.message);
   }
    


  }
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e)=>{
          setFile(e.target.files[0])
        }} type='file' hidden ref={fileRef} accept='image/*'/>
        <img onClick={()=>{fileRef.current.click()}} src={formData.avatar||currentUser.avatar} alt="profile pic" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
        <input type='text' placeholder='username' id="username" className='border p-3 rounded-lg' defaultValue={currentUser.username} onChange={handleOnChange
        }/>
        <input type='email' placeholder='email' id="email" className='border p-3 rounded-lg' defaultValue={currentUser.email} onChange={handleOnChange
        }/>
        <input type='password' placeholder='password' id="password" className='border p-3 rounded-lg' onChange={handleOnChange
        }/>
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading?'Loading...':'Update'}</button> 
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to='/create-listing'>Create Listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDelete} className='text-red-700 cursor-pointer'>Delete</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>

      </div>

      <button type='button' onClick={handleShowListings} className='text-green-700 w-full'>Show Listings</button>
       <p className='text-red-700'>{showError?showError:""}</p>

       {
        userListings&&userListings.length>0&& 
        userListings.map((listing)=><div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
          <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} className='h-16 w-16 object-contain'/>
          </Link>
          <Link className='text-slate-700 font-semibold truncate flex-1' to={`/listing/${listing._id}`}>
            <p>{listing.name}</p>
          </Link>
          <div className="flex flex-col item-center">
            <button onClick={()=>handleListingDelete(listing._id)} className='text-red-700'>Delete</button>
            <button className='text-green-700'>Edit</button>
          </div>
        </div>)
       }

      
    </div>
  )
}
