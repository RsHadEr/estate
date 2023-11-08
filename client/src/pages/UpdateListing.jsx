import React, { useEffect, useState } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase';
import {useSelector} from 'react-redux';
import {useNavigate,useParams} from 'react-router-dom';






export default function CreateListing() {
    const {currentUser}=useSelector(state=>state.user);
    const navigate=useNavigate();
    const params=useParams();
    const [files,setFiles]=useState([]);
    const [error,setError]=useState(false);
    const [loading,setLoading]=useState(false);
   
    const [uploading,setUploading]=useState(false);
    const [imageUploadError,setImageUploadError]=useState(false);
    const [formData,setFormData]=useState({
        imageUrls:[],
        name:'',
        description:'',
        address:'',
        type:'rent',
        bedrooms:1,
        bathrooms:1,
        regularPrice:0,
        discountPrice:0,
        offer:false,
        parking:false,
        furnished:false,

    });

    useEffect(()=>{

        const fetchListing=async()=>{
            const listingId=params.listingId;
            const res=await fetch(`/api/listing/get/${listingId}`);
            const data=await res.json();
            if(data.success===false)
            {
                console.log(data.message);
                return;
            }
            setFormData(data);

        }

        fetchListing();

    },[]);
    console.log(formData);

    
    const handleImageSubmit=(e)=>{
        console.log("clicked");
        setUploading(true);
        if(files.length>0&&files.length + formData.imageUrls.length<7)
        {
            console.log(files);
            const promises=[];
            for(let i=0;i<files.length;i++)
            {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls)=>{
                setFormData({...formData,imageUrls:formData.imageUrls.concat(urls)});
                setImageUploadError(false);
                setUploading(false);

            }).catch((err)=>{
                setImageUploadError('image must be less than 2mb');
                setUploading(false);
            });


        }
        else{
            setImageUploadError("Only 6 image allowed")
        }
    };
  
    const storeImage= async (file)=>{
        return new Promise((resolve,reject)=>{
            const storage=getStorage(app);
            const fileName=new Date().getTime()+file.name;
            const storageRef=ref(storage,fileName);
            const uploadTask=uploadBytesResumable(storageRef,file);
            uploadTask.on(
                "state_changed",
                (snapshot)=>{
                    const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
                    console.log(`upload is ${progress}%done`);

                },
                (error)=>{
                    reject(error);

                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        resolve(downloadURL);


                    });
                }
            );
        
        
        })

     }

     const handleRemoveImage=(index)=>{
        setFormData({...formData,imageUrls:formData.imageUrls.filter((_,i)=>i!=index),});
     }

     const handleSubmit=(e)=>{
        if(e.target.id==='sale'||e.target.id==='rent')
        {
            setFormData({...formData,type:e.target.id});
        }
        if(e.target.id==='parking'||e.target.id==='furnished'||e.target.id==='offer')
        {
            setFormData({
                ...formData,
                [e.target.id]:e.target.checked,
            })
        }
        if(e.target.type==='text'||e.target.type==='number'||e.target.type==='textarea')
        {
            setFormData({
                ...formData,
                [e.target.id]:e.target.value,
            })
        }

     }


     const handleFormSubmit=async(e)=>{
        e.preventDefault();
        try {
            setError(false);
            setLoading(true);

            const res=await fetch(`/api/listing/update/${params.listingId}`,{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    ...formData,
                    userRef:currentUser._id,
                }),
            });
            const data=await res.json();
            console.log(data);
            setLoading(false);
            if(data.success===false)
            {
                setError(data.message);
            }
            else{
                navigate(`/listing/${data._id}`);
            }
            
        } catch (error) {
            setError(error.message);
            setLoading(false);
            
        }

     }




  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Update a Listing</h1>
      <form onSubmit={handleFormSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
           <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='4' required onChange={handleSubmit} value={formData.name} />
           <input type="text" placeholder='Description' className='border p-3 rounded-lg' id='description'  required onChange={handleSubmit} value={formData.description} />
           <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='address'  required onChange={handleSubmit} value={formData.address}/>
           <div className='flex gap-5 flex-wrap'>
            <div className='flex gap-2'>
                <input type='checkbox' id='sale' className='w-5' onChange={handleSubmit} checked={formData.type==='sale'}/>
                <span>Sell</span>
            </div>
            <div className='flex gap-2'>
                <input type='checkbox' id='rent' className='w-5' onChange={handleSubmit} checked={formData.type==='rent'}/>
                <span>Rent</span>
            </div>
            <div className='flex gap-2'>
                <input type='checkbox' id='parking' className='w-5' onChange={handleSubmit} checked={formData.parking}/>
                <span>Need a parking?</span>
            </div>
            <div className='flex gap-2'>
                <input type='checkbox' id='furnished' className='w-5' onChange={handleSubmit} checked={formData.furnished}/>
                <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
                <input type='checkbox' id='offer' className='w-5' onChange={handleSubmit} checked={formData.offer}/>
                <span>Offer</span>
            </div>
            <div className="flex flex-wrap gap-5">
            <div className="flex item-center gap-2">
                    <input type="number" id='bedRooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' onChange={handleSubmit} value={formData.bedRooms}/>
                    <p>Beds</p>
                </div>
                <div className="flex item-center gap-2">
                    <input type="number" id='bathRooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' onChange={handleSubmit} value={formData.bathRooms}/>
                    <p>Baths</p>
                </div>
                <div className="flex item-center gap-2">
                    <input type="number" id='regularPrice' min='10' max='100000' required className='p-3 border border-gray-300 rounded-lg' onChange={handleSubmit} value={formData.regularPrice}/>
                    <div className="flex flex-col item-center"><p>Regular Price</p><span className='text-xs'>($ / month)</span></div>
                </div>
                {formData.offer && ( <div className="flex item-center gap-2">
                    <input type="number" id='discountPrice' min='0' max='1000' required className='p-3 border border-gray-300 rounded-lg' onChange={handleSubmit} value={formData.discountPrice}/>
                    <div className="flex flex-col item-center"><p>Discounted Price</p><span className='text-xs'>($ / month)</span></div>
                </div>)}
               
                
            </div>
           


           
           
            </div>
       
       
        </div>
        <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>Images:</p>
            <div className="flex gap-4">
                <input onChange={(e)=>setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
                <button type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading?'Uploading...':'Upload'}</button>
                </div>
                <p className='text-red-700'>{imageUploadError&&imageUploadError}</p>
                {
                    formData.imageUrls.length>0&&formData.imageUrls.map((url,index)=>(
                     <div key={url} className="flex justify-between p-3 border items-center">
                        <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg ' />
                        <button onClick={()=>handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>

                     </div>
                    ))
                }
               
                
            
            <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading?'Updating':'Update Listing'}</button>
            {error&&<p className='text-red-700 text-sm'>{error}</p>}
      
        </div>
      </form>
    </main>
  )
}