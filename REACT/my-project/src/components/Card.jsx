import React from 'react'

/**
* @author
* @function 
**/

export default  function Card ({name, title, imageUri}) {
  return(
    <div className='border grid grid-cols-2 h-40' >
        <div className='p4'>
            <h2 className='font bold text-xl'>{name}</h2>
            <h4>{title}</h4>
            </div>
            <div className='bg-green-400 w-full'>
                <img src={imageUri} alt='' className='object-cover w-full h-full'/>
                
        </div>
    </div>
   )

 }
 //className='object-cover w-full h-full'