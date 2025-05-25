import { LS_KEY_PLANNED_ENTRIES } from "variables"

export const getPlannedEntries=()=>{
  let data=localStorage.getItem(LS_KEY_PLANNED_ENTRIES)
  if(data!=null) return JSON.parse(data)
  else return undefined
}

export const addPlannedEntry=(entry)=>{
  console.log(entry)
  let data=localStorage.getItem(LS_KEY_PLANNED_ENTRIES)
  if(data==null){
    
  }else if(data!=null){
    return {result:true}
  }else return {result:false}
}