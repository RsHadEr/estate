import React, { useEffect, useRef, useState } from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {getStorage, uploadBytesResumable,ref, getDownloadURL} from 'firebase/storage'

import { app } from '../firebase';
import { updateUserStart,updateUserFailure,updateUserSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess } from '../redux/user/userslice';


export default function Profile() {
  const dispatch=useDispatch();
  const fileRef=useRef(null);
  const [file,setFile]=useState(undefined);
  const {currentUser,loading,error}=useSelector((state)=>state.user);
  useEffect(()=>{
   if(file)
   {
    handleFileUpload(file);
   }
  },[file]);
  const [filePerc,setFilePerc]=useState(0);
  const [formData,setFormData]=useState({});
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
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDelete} className='text-red-700 cursor-pointer'>Delete</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>

      </div>

      
    </div>
  )
}
