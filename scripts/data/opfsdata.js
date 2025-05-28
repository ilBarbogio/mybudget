import { APP_VERSION } from "../variables.js"

//utils
export const formatRecordFilename=(user,year)=>`${user}__${year}.json`
// const formatRecordEntry=(data)=>{return {id:data.id,value:data.value,date:data.date,cause:data.cause}}
// const stringifyState=()=>{
//   if(state){
//     const abdridgedState={
//       user:state.user,
//       year:state.year,
//       goals:state.goals,
//       records:state.records,
//     }
//     const stringified=JSON.stringify(abdridgedState)
//     return stringified
//   }
// }

//core
let fsRootDir,fsCurrentFile

export const connectMain=async ()=>{
  fsRootDir=await navigator.storage.getDirectory()
  if(fsRootDir) return {result:true}
  else return {result:false}
}

export const listRecordFiles=async ()=>{
  try{
    if(!fsRootDir) fsRootDir=await navigator.storage.getDirectory()
    const files=[]
    for await(let [name,handle] of fsRootDir.entries()){
      if(handle.kind=="file") files.push(name)
    }
    return {result:true,files}
  }catch(err){
    return {result:false,message:err}
  }
}

export const createRecordFile=async(user,year,records=[],goals=[],options={filename:undefined})=>{
  try{
    if(!fsRootDir) fsRootDir=await navigator.storage.getDirectory()
    const filename=options?.filename??formatRecordFilename(user,year)
    
    const files=[]
    for await(let [name,handle] of fsRootDir.entries()){
      if(handle.kind=="file") files.push(name)
    }
    if(files.includes(filename)) throw("File already exists")
    
    const opfsFile=await fsRootDir.getFileHandle(filename,{create:true})
    
    let emtpyFileObject={
      user,
      year,
      version:APP_VERSION,
      records,
      goals
    }
    let dataString=JSON.stringify(emtpyFileObject)
    
    const writeStream=await opfsFile.createWritable()
    await writeStream.write(dataString)
    await writeStream.close()
    return {result:true}
  }catch(err){
    return {result:false,message:err}
  }
}

export const readRecordFile=async(filename)=>{
  if(filename){
    try{
      if(!fsRootDir) fsRootDir=await navigator.storage.getDirectory()
      fsCurrentFile=await fsRootDir.getFileHandle(filename)
      let blob=await fsCurrentFile.getFile()
      let data=await blob.text()
      data=JSON.parse(data)
      return {result:true, data}
    }catch(err){
      return {result:false, message:err}
    }
  }else return {result:false, message:"No file specified"}
}

export const writeRecordFile=async(user,year,records,planned,goals)=>{
  try{
    if(!fsRootDir) fsRootDir=await navigator.storage.getDirectory()
    fsCurrentFile=await fsRootDir.getFileHandle(formatRecordFilename(user,year))
  
    const dataString=JSON.stringify({
      user,
      year,
      records,
      planned,
      goals
    })
    const writeStream=await fsCurrentFile.createWritable()
    await writeStream.write(dataString)
    await writeStream.close()
    return {result:true}
  }catch(err){
    return {result:false,message:err}
  }
}

export const removeRecordFile=async(filename)=>{
  try{
    if(!filename) throw(new Error("Filename is required"))
    if(!fsRootDir) fsRootDir=await navigator.storage.getDirectory()
    let file=await fsRootDir.getFileHandle(filename)
    await file.remove()
    return {result:true}
  }catch(err){
    return {result:false,message:err}
  }
}

export const renameRecordFile=async(filename,newFilename)=>{
  console.log("TO BE IMPLEMENTED")
  return {result:false}
  try{
    if(!filename || !newFilename) throw(new Error("Filename is required"))
    if(!fsRootDir) fsRootDir=await navigator.storage.getDirectory()
    let file=await fsRootDir.getFileHandle(filename)
    await file.move()
    // localStorage.removeItem(LS_KEY_CURRENT_FILE)
    // fsCurrentFile=undefined
    // resetState()
    return {result:true}
  }catch(err){
    return {result:false,message:err}
  }
}