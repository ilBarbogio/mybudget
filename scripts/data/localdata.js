import { LS_KEY_PLANNED_ENTRIES } from "variables"
import { state } from "data/state.js"

const getLSKey=(user,year)=>{
 return `${LS_KEY_PLANNED_ENTRIES}__${user}__${year}`
}

export const getPlannedEntries=(user,year)=>{
  let data=localStorage.getItem(getLSKey(user,year))
  if(data!=null){
    const localData=JSON.parse(data)
    return localData.planned
  }else return undefined
}

export const addPlannedEntry=(user,year,entry)=>{
  console.log(entry)
  let data=localStorage.getItem(getLSKey(user,year))
  if(data==null){
    
  }else if(data!=null){
    return {result:true}
  }else return {result:false}
}

// export const buildPlannedRecord=(frequency,dates,reference)=>{
//   //frequency: 0 oneshot, 1 daily, 2 weekly, 3 monthly
//   //dates:[start, end]
//   //reference: weekday or month
//   const f=getInput("planned-frequency").value
//   switch(f){
//     case "0"://one shot
//       return {
//         frequency:f,
//         dates:[this.getInput("planned-start-date").value,undefined],
//         reference:undefined
//       }
//     case "1"://daily
//       return {
//         frequency:f,
//         dates:[this.getInput("planned-start-date").value,undefined],
//         reference:undefined
//       }
//       this.getInput("planned-start-date").disabled=false
//       this.getInput("date").value=`${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2,"0")}-${currentDate.getDate().toString().padStart(2,"0")}`
//       this.getInput("planned-end-date").disabled=false
//       this.getInput("planned-weekday").disabled=true
//       this.getInput("planned-month").disabled=true
//       break
//     case "2"://weekly
//       this.getInput("planned-start-date").disabled=false
//       this.getInput("date").value=`${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2,"0")}-${currentDate.getDate().toString().padStart(2,"0")}`
//       this.getInput("planned-end-date").disabled=false
//       this.getInput("planned-weekday").disabled=false
//       this.getInput("planned-weekday").value=currentDate.getDay()
//       this.getInput("planned-month").disabled=true
//       break
//     case "3"://monthly
//       this.getInput("planned-start-date").disabled=false
//       this.getInput("date").value=`${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2,"0")}-${currentDate.getDate().toString().padStart(2,"0")}`
//       this.getInput("planned-end-date").disabled=false
//       this.getInput("planned-weekday").disabled=true
//       this.getInput("planned-month").disabled=false
//       this.getInput("planned-month").value=currentDate.getMonth()
//       break
//   }
// }
