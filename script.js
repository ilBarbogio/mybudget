import {
  readRecordFile, connectMain, createRecordFile,
  setupListeners as setupDataListeners
} from "./scripts/data/opfsdata.js"
import { state, LOADED_DATA_FROM_FILE, LS_KEY_CURRENT_FILE } from "./scripts/variables.js"
import { buildCalendarPage, buildFileManagerPage } from "./scripts/transitions.js"
import { readDiskData } from "./scripts/data/files.js"


const appSetup=async()=>{
  state.container=document.getElementById("container")
  
  setupDataListeners()

  if(localStorage.getItem(LS_KEY_CURRENT_FILE)) state.currentFile=localStorage.getItem(LS_KEY_CURRENT_FILE)
  console.log(state.currentFile)
  if(state.currentFile){
    await buildCalendarPage()
  }else{
    await buildFileManagerPage()
  }
  
  // let event=new CustomEvent(NAVIGATE,{detail:{route:"calendar"}})
  // state.toolbar.dispatchEvent(event)
}

appSetup()
