import React, { useEffect, useState } from 'react'
import Card from './Card'

/**
* @author
* @function 
**/

export default  function Peoplecontainer () {
const [people, setPeople] = useState([])
const [filteredPeople,setFilteredPeople] = useState([]);

useEffect(() => {
  fetch("https://65b38641770d43aba479f04d.mockapi.io/person").then(
    (res) =>res.json().then((data) => { 
      console.log(data) 
    setPeople(data);
    setFilteredPeople(data);
  })
  );
}, []);


const filterPeople =(filter) =>{
  let filtered = people.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));
  setFilteredPeople (filtered);
}

  return(
    <div className='' >
        <div className="fixed border mb-4 bg-white-400 w-full h-28 p-8">
          <input className="border p-4" 
          type="text" 
          placeholder="Search" 
          onChange={(el) =>{
            console.log(el.target.value)
            filterPeople(el.target.value)
          }} 
          />
        </div>

        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 p-8 pt-32'>
          {filteredPeople.map((person) =>{
            return( 
            <Card name ={person.name} 
            imageUri={person.avatar} 
            title={person.jobtitle}
            />
            )})}
        </div>
    </div>
   )

 }