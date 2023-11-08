import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {

    const [landLord,setLandLord]=useState(null);
    const [message,setMessage]=useState('');

    const onChange= (e)=>{
        setMessage(e.target.message);

    }

    useEffect(()=>{

         const fetchLandLord=async () =>{
            try {
                const res=await fetch(`/api/user/${listing.userRef}`);
                const data=await res.json();
                setLandLord(data);
            } catch (error) {
                console.log(error);
            }
         }

         fetchLandLord();

    },[listing.userRef]);

  return (
    <div>
        {landLord&&(
            <div className="flex flex-col gap-2">
                <p>Contact<span className='font-semibold'>{landLord.username}</span> for <span>{listing.name.toLowerCase()}</span></p>
                <textarea name="message" id="message" cols="30" rows='30' value={message} onChange={onChange} placeholder='Enter your message' className='w-full border p-3 rounded-lg '></textarea>
                <Link to={`mailto:${landLord.email}?subject=Regarding ${listing.name}&body=${message}`} className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity'>Send Message</Link>
            </div>
        )}
      
    </div>
  )
}
