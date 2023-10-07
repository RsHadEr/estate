import React, { useEffect, useRef, useState } from 'react'
import {useSelector} from 'react-redux'
import {getStorage, uploadBytesResumable,ref, getDownloadURL} from 'firebase/storage'

import { app } from '../firebase';


export default function Profile() {
  const fileRef=useRef(null);
  const [file,setFile]=useState(undefined);
  const {currentUser}=useSelector((state)=>state.user);
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
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input onChange={(e)=>{
          setFile(e.target.files[0])
        }} type='file' hidden ref={fileRef} accept='image/*'/>
        <img onClick={()=>{fileRef.current.click()}} src={formData.avatar||currentUser.avatar} alt="profile pic" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
        <input type='text' placeholder='username' id="username" className='border p-3 rounded-lg'/>
        <input type='email' placeholder='email' id="email" className='border p-3 rounded-lg'/>
        <input type='text' placeholder='password' id="password" className='border p-3 rounded-lg'/>
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>Update</button> 
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>

      </div>

      
    </div>
  )
}
