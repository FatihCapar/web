import classes from './Buttonlist.module.css'
import React from "react";
import Button from "./Button";


export default function Buttonlist({myarray}){
    return(
        <>
        {
            myarray.map(( wert, index )=>{
                return <Button className= {classes.card} key= {index} info={wert + ' '+ index}/>
              }
            )
              
        }
        </>
    )
}