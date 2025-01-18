// export const readDiskData=async (url,options=undefined)=>{
//   console.log("fetching")
//   const textData=await fetch(url).then(res=>res.text())
//   // console.log(textData)

import { APP_VERSION } from "../variables.js"
import { createRecordFile, readRecordFile, writeRecordFile } from "./opfsdata.js"

export const createFile=async (user,year,records,goals,options={filename:undefined})=>{
  let res=await createRecordFile(user,year,options)

}
export const readFile=async (filename)=>{
  let res=await readRecordFile(filename)
}
export const writeFile=async (user,year,records,goals)=>{
  let res=await writeRecordFile()
}

//   if(options?.legacyFile) return parseLegacyData(textData)
// }

export const downloadDataFile=async (filename,format)=>{
  console.log(filename,format)
  let [user,year]=filename.replace(".json","").replace("csv","").split("__")
  let res=await readRecordFile(filename)
  let date=new Date()
  date=`${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
  if(res.result) switch(format){
    case "json": return JSON.stringify({...res.data,version:APP_VERSION,meta:date})
    case "csv": return dataToCSV(res.data.user,res.data.year,APP_VERSION,date,res.data)
    default: return undefined
  }
}

const dataToCSV=(user,year,version,meta,data)=>{
  let dataString=`user,year,version,meta\n`
  dataString+=`${user},${year},${version},${meta}\n`
  dataString+=`id,date,value,category,cause\n`
  for(let r of data.records){
    dataString+=`${r.id},${r.date},${r.value},${r.category!==undefined?r.category:""},${r.cause}\n`
  }
  return dataString
}

export const parseDataFile=async (file)=>{
  if(file.name.endsWith(".csv")){
    let textData=await file.text()
    let {user,year,data,meta1,meta2}=parseCsvData(textData)
    console.log(user,year,data,meta1,meta2)
  }else if(file.name.endsWith(".json")){

  }
}

/**
csv formatting: first two row store name and values for user, year, and two metadata column
    user,year,meta1,meta2
    <name>,<year>,<meta1>,<meta2>
  third row stores data columns names, then the actual data 

  LEGACY FORMAT: meta1 and meta2 are set to unused, data columns are the following
    id,date,cash,cause
  
  CURRENT FORMAT: meta1 stores the app's version x.x.x, meta2 generic metadata, data columns are
    id,date,value,category,cause
*/
const parseCsvData=(dataString)=>{
  let data=dataString.split("\n")
  let [user,year,meta1,meta2]=data[1].split(",")
  let version=meta1=="unused"&&meta2=="unused"?"legacy":meta1

  let keys=data[2]
  if(version=="legacy") keys=keys.replace("cash","value")
  keys=keys.split(",")

  let records=[]

  for(let i=3;i<data.length;i++){
    let values=data[i].split(",")
    if(values!=undefined && values.length>1){
      let record={}
      for(let [j,k] of keys.entries()) record[k]=values[j]
      
      record.id=Number.parseInt(record.id)
      records.push(record)
    }
  }
  return {user,year,varsion:meta1,meta2,data:{records}}
}