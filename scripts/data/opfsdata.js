import {
  ADD_ENTRY_EVENT, UPDATE_ENTRY_EVENT, DELETE_ENTRY_EVENT,
  ADD_ENTRY_CONFIRM_EVENT, UPDATE_ENTRY_CONFIRM_EVENT, DELETE_ENTRY_CONFIRM_EVENT,
  state,
  UPLOADED_FILE_DATA_LEGACY,
  LS_KEY_CURRENT_FILE,
  resetState
} from "../variables.js"

//utils
const recordFilename=(user,year)=>`${user}__${year}.json`
const formatRecordEntry=(data)=>{return {id:data.id,value:data.value,date:data.date,cause:data.cause}}
const stringifyState=()=>{
  if(state){
    const abdridgedState={
      user:state.user,
      year:state.year,
      goals:state.goals,
      records:state.records,
    }
    const stringified=JSON.stringify(abdridgedState)
    return stringified
  }
}

//core
let fsRootDir,fsCurrentFile

export const connectMain=async ()=>{
  fsRootDir=await navigator.storage.getDirectory()
  if(fsRootDir) return {result:true}
  else return {result:false}
}
// export const connectRecordFile=async ()=>{
//   fsRecordFile=await fsRootDir.getFileHandle(recordFilename(state.user,state.year),{create:true})
//   if(fsRecordFile) return {result:true}
//   else return {result:false}
// }

export const createRecordFile=async(user,year,data,options={legacyFile:false,openAfter:false})=>{
  try{
    if(!fsRootDir) fsRootDir=await navigator.storage.getDirectory()
    const filename=recordFilename(user,year)
    const opfsFile=await fsRootDir.getFileHandle(filename,{create:true})
    let dataString="{\n"
    //header
    dataString+=`\t"version":${options.version??1},\n`
    dataString+=`\t"user":"${user}",\n`
    dataString+=`\t"year":${year},\n`
    //goals
    dataString+=`\t"goals":[\n`
    if(!options?.legacyFile){
      //BUILD GOALS
    }
    dataString+=`\t],\n`
    //records
    dataString+=`\t"records":[\n`
    let maxId=0
    for(let [i,d] of data.records.entries()){
      if(d.id>maxId) maxId=d.id
      dataString+=`\t\t${JSON.stringify(formatRecordEntry(d))}${i<data.records.length-1?",":""}\n`
    }
    dataString+=`\t]\n`
    // state.maxId=maxId
    
    dataString+=`}`
    
    const writeStream=await opfsFile.createWritable()
    await writeStream.write(dataString)
    await writeStream.close()
    if(options.openAfter) await readRecordFile(filename)
    return {result:true}
  }catch(err){
    return {result:false,message:err}
  }
}

export const readRecordFile=async(filename=state.currentFile)=>{
  console.log(filename)
  if(filename){
    try{
      if(!fsRootDir) fsRootDir=await navigator.storage.getDirectory()
      if(!fsCurrentFile) fsCurrentFile=await fsRootDir.getFileHandle(filename)
      let blob=await fsCurrentFile.getFile()
      let data=await blob.text()
      data=JSON.parse(data)

      let split=filename.split(".")
      let [user,year]=split[0].split("__")
      state.user=user
      state.year=year
      state.currentFile=filename
      localStorage.setItem(LS_KEY_CURRENT_FILE,filename)

      let maxId=0
      for(let d of data.records) if(d.id>maxId) maxId=d.id
      state.maxId=maxId

      state.records=data.records
      return {result:true}
    }catch(err){
      return {result:false,message:err}
    }
  }else return {result:false, message:"", code:404}
}

export const writeRecordFile=async(filename=state.currentFile)=>{
  try{
    if(!fsRootDir) fsRootDir=await navigator.storage.getDirectory()
    if(!fsCurrentFile) fsCurrentFile=await fsRootDir.getFileHandle(filename)
    // let dataString=""
    // for(let d of state.data){
    //   dataString+=JSON.stringify(d)+"\n"
    // }
    console.log(fsCurrentFile)
    console.log(state)
    const dataString=stringifyState()
    console.log(dataString)
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
    // localStorage.removeItem(LS_KEY_CURRENT_FILE)
    // fsCurrentFile=undefined
    // resetState()
    return {result:true}
  }catch(err){
    return {result:false,message:err}
  }
}

export const addRecord=async(record)=>{
  record.id=state.maxId+1
  state.records.push(record)
  state.maxId=state.maxId+1
  let result=await writeRecordFile()
  return {...result,record}
}

export const updateRecord=async(record)=>{
  let index=state.records.findIndex(el=>el.id==record.id)
  if(index>=0){
    state.records[index]={...record}
    let result=await writeRecordFile()
    return {...result,record}
  }else return {result:false}
}

export const removeRecord=async(id)=>{
  let index=state.records.findIndex(el=>el.id==id)
  if(index>=0){
    state.records.splice(index,1)
    let result=await writeRecordFile()
    return {...result,id}
  }else return {result:false}
}


export const listFiles=async ()=>{
  try{
    if(!fsRootDir) fsRootDir=await navigator.storage.getDirectory()
    const files=[]
    for await(let [name,handle] of fsRootDir.entries()){
      if(handle.kind=="file"){
        // const split=name.split("_")
        // files.push({name:split[0],year:split[1]})
        files.push(name)
      }
    }
    state.availableFiles=files
    return {result:true}
  }catch(err){
    return {result:false,message:err}
  }
  
}


export const setupListeners=()=>{
  window.addEventListener(ADD_ENTRY_EVENT,async(ev)=>{
    console.log(ev.detail)
    let response=await addRecord(ev.detail)
    if(response.result){
      console.log(response)
      let event=new CustomEvent(ADD_ENTRY_CONFIRM_EVENT,{detail:response.record})
      window.dispatchEvent(event)
    }else{
      console.error("Add entry error")
    }
  })
  window.addEventListener(UPDATE_ENTRY_EVENT,async(ev)=>{
    let response=await updateRecord(ev.detail)
    if(response.result){
      let event=new CustomEvent(UPDATE_ENTRY_CONFIRM_EVENT,{detail:response.record})
      window.dispatchEvent(event)
    }else{
      console.log("Update entry error")
    }
  })
  window.addEventListener(DELETE_ENTRY_EVENT,async(ev)=>{
    let response=await removeRecord(ev.detail.id)
    if(response.result){
      let event=new CustomEvent(DELETE_ENTRY_CONFIRM_EVENT,{detail:{id:response.id}})
      window.dispatchEvent(event)
    }else{
      console.error("Remove entry record")
    }
  })

  window.addEventListener(UPLOADED_FILE_DATA_LEGACY,async(ev)=>{
    let {user,year,data}=ev.detail
    await createRecordFile(user,year,data,{version:1,legacyFile:true})
  })

  // window.addEventListener(LOADED_DATA_FROM_FILE,()=>{
  //   console.log(state)
  // })
}