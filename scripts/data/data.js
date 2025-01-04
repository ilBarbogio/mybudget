import {
  ADD_ENTRY_EVENT,
  ADD_ENTRY_CONFIRM_EVENT,
  MAIN_DATABASE_NAME,
  MAIN_DATABASE_RECORD_STORE_NAME,
  DATABASE_NAME,
  DATABASE_RECORD_STORE_NAME,
  DELETE_ENTRY_EVENT,
  DELETE_ENTRY_CONFIRM_EVENT,
  UPDATE_ENTRY_EVENT,
  UPDATE_ENTRY_CONFIRM_EVENT,
  state } from "../variables.js"

let mainDatabase,database

//create record database, eventually recovering from disk
export const restoreDataFromDisk=async(filename,cleanBefore=false)=>{
  if(filename){
    let {user,year,records}=await readDiskData(`./scripts/data/${filename}`)
    await createDatabase(user,year,records)
  }
}

const readDiskData=async (url)=>{
  console.log("fetching")
  const textData=await fetch(url).then(res=>res.text())
  // console.log(textData)

  let arrayData=textData.split("\n")

  return parseData(arrayData)
}

const parseData=(data)=>{
  let keys=data[2].replace("cash","value").split(",")
  let user=data[1].split(",")[0]
  let year=data[1].split(",")[1]
  let records=[]
  for(let i=3;i<data.length;i++){
    let values=data[i].split(",")
    if(values!=undefined && values.length>1){
      let record={}
      for(let [j,k] of keys.entries()){
        record[k]=values[j]
      }
      record.id=Number.parseInt(record.id)
      records.push(record)
    }
  }
  return {user,year,records}
}

const createDatabase=async (user,year,data)=>{
  console.log(data)
  let request=window.indexedDB.open(`${DATABASE_NAME}_${user.toLowerCase()}_${year}`,1)
  request.onupgradeneeded=(ev)=>{
    console.log("UPDATE")
    if(data){
      database=ev.target.result
      createStores(data)
    }
  }
  //no onsuccess, as opening isn't the goal of this function
  request.onerror=(ev)=>{
    console.error("CREATE DATABASE ERROR")
    console.log(ev.target.errorCode)
  }
}

const createStores=(data)=>{
  if(database!=undefined){
    console.log("CREATE STORES")
    let store=database.createObjectStore(DATABASE_RECORD_STORE_NAME,{keyPath:"id",autoIncrement:true})
    store.transaction.oncomplete=(ev)=>{
      if(data) addBulkDataInternal(data)
    }
  }
}

const addBulkDataInternal=(data)=>{
  console.log("ADD BULK",data)
  let transaction=database.transaction([DATABASE_RECORD_STORE_NAME],"readwrite")
  let objectStore=transaction.objectStore(DATABASE_RECORD_STORE_NAME)
  for(let d of data){
    let request=objectStore.add(d)
  }
}


//get records
export const getRecords=async ()=>{
  if(await openDatabaseInternal()){
    let response=await getRecordsInternal()
    if(response.result) return response.records
    else{
      console.error(response.error)
    }
  }
}

export const getRecordsInternal=()=>new Promise((res,rej)=>{
  let transaction=database.transaction(DATABASE_RECORD_STORE_NAME)
  .objectStore(DATABASE_RECORD_STORE_NAME)
  .getAll()
  transaction.onsuccess=(ev)=>{
    res({result:true,records:ev.target.result})
  }
  transaction.onerror=(ev)=>{
    rej({result:false,error:ev.target.errorCode})
  }
})

//delete record
export const deleteEntry=async (id)=>{
  if(await openDatabaseInternal()){
    let response=await deleteEntryInternal(id)
    if(response.result){
      let event=new CustomEvent(DELETE_ENTRY_CONFIRM_EVENT,{detail:
        {
          id
        }
      })
      window.dispatchEvent(event)
    }else{
      console.error(response.error)
      return undefined
    }
  }
}
const deleteEntryInternal=(id)=>new Promise((res,rej)=>{
  let transaction=database.transaction([DATABASE_RECORD_STORE_NAME],"readwrite")
  .objectStore(DATABASE_RECORD_STORE_NAME)
  .delete(id)
  transaction.onsuccess=(ev)=>{
    res({result:true,id})
  }
  transaction.onerror=(ev)=>{
    rej({result:false,error:ev.target.errorCode})
  }
})

//add record
export const addEntry=async (data)=>{
  if(await openDatabaseInternal()){
    let response=await addEntryInternal(data)
    if(response.result){
      let event=new CustomEvent(ADD_ENTRY_CONFIRM_EVENT,{detail:
        {
          id:response.result.id,
          ...data
        }
      })
      window.dispatchEvent(event)
    }else{
      console.error(response.error)
      return undefined
    }
  }
}
const addEntryInternal=(data)=>new Promise((res,rej)=>{
  let transaction=database.transaction([DATABASE_RECORD_STORE_NAME],"readwrite")
  .objectStore(DATABASE_RECORD_STORE_NAME)
  .add(data)
  transaction.onsuccess=(ev)=>{
    res({result:true,id:ev.target.result})
  }
  transaction.onerror=(ev)=>{
    console.log("FAILED")
    rej({result:false,error:ev.target.errorCode})
  }
})

//update record
export const updateEntry=async (data)=>{
  console.log(data)
  if(await openDatabaseInternal()){
    let response=await updateEntryInternal(data)
    if(response.result){
      let event=new CustomEvent(UPDATE_ENTRY_CONFIRM_EVENT,{detail:
        {
          id:response.result.id,
          ...data
        }
      })
      window.dispatchEvent(event)
    }else{
      console.error(response.error)
      return undefined
    }
  }
}
const updateEntryInternal=(data)=>new Promise((res,rej)=>{
  let transaction=database.transaction([DATABASE_RECORD_STORE_NAME],"readwrite")
  .objectStore(DATABASE_RECORD_STORE_NAME)
  .put(data)
  transaction.onsuccess=(ev)=>{
    res({result:true,id:ev.target.result})
  }
  transaction.onerror=(ev)=>{
    console.log("FAILED")
    rej({result:false,error:ev.target.errorCode})
  }
})



const openDatabaseInternal=()=>new Promise((res,rej)=>{
  console.log(database)
  if(database) res(true)
  else{
    let request=window.indexedDB.open(`${DATABASE_NAME}_${state.user}_${state.year}`,1)
    request.onsuccess=ev=>{
      database=ev.target.result
      res(true)
    }
    request.onerror=(ev)=>{
      res(false)
    }
    request.onupgradeneeded=(ev)=>{
      res(false)
    }
  }
})


export const setupListeners=()=>{
  window.addEventListener(DELETE_ENTRY_EVENT,(ev)=>{
    deleteEntry(ev.detail.id)
  })
  
  window.addEventListener(ADD_ENTRY_EVENT,async (ev)=>{
    addEntry(ev.detail)
  })
  
  window.addEventListener(UPDATE_ENTRY_EVENT,async (ev)=>{
    updateEntry(ev.detail)
  })
}