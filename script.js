import {
  readRecordFile, connectMain, createRecordFile,
  setupListeners as setupDataListeners
} from "./scripts/data/opfsdata.js"
import { state, LOADED_DATA_FROM_FILE, LS_KEY_CURRENT_FILE } from "./scripts/variables.js"
import { buildCalendarPage, buildFileManagerPage } from "./scripts/transitions.js"
import { readDiskData } from "./scripts/data/files.js"

const registerServiceWorker = async () => {
  if("serviceWorker" in navigator){
    try{
      const registration = await navigator.serviceWorker.register("/sw.js",{
        scope: "/",
      })
      if(registration.installing){
        console.log("Service worker installing")
      }else if(registration.waiting){
        console.log("Service worker installed")
      }else if(registration.active){
        console.log("Service worker active")
      }
    }catch(error){
      console.error(`Registration failed with ${error}`)
    }
  }
}

const appSetup=async()=>{
  // await registerServiceWorker()
  state.container=document.getElementById("container")
  
  setupDataListeners()


  if(localStorage.getItem(LS_KEY_CURRENT_FILE)) state.currentFile=localStorage.getItem(LS_KEY_CURRENT_FILE)
  console.log(state.currentFile)
  if(state.currentFile){
    // await buildCalendarPage()
    await buildFileManagerPage()
  }else{
    await buildFileManagerPage()
  }
}

appSetup()



