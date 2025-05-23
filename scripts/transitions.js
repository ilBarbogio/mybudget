import { state } from "./data/state.js"
import { NAVIGATE, LS_KEY_CURRENT_FILE, LOADED_DATA_FROM_FILE, pages, categories } from "./variables.js"

function updateView(ev){
  let page=ev.route

  //trasition
  let buildDestination
  switch(page){
    case pages.calendar:
      buildDestination=buildCalendarPage
      break
    case pages.filemanager:
      buildDestination=buildFileManagerPage
      break
    case pages.goalspage:
      buildDestination=buildGoalsPage
      break
    case pages.reportspage:
      buildDestination=buildReportsPage
      break
    default: break
  }
  const transition = document.startViewTransition(buildDestination)
}

export const buildCalendarPage=async ()=>{
  const response=await state.loadFile()
  
  if(response.result){
    state.elements.container.innerHTML=""

    state.elements.yearContainer=document.createElement("year-container")
    state.elements.yearContainer.classList.add("content")
    state.elements.yearContainer.setAttribute("year",state.year)
    state.elements.container.append(state.elements.yearContainer)

    state.elements.yearContainer.data=state.records

    state.currentPage=pages.calendar
  }
}

export const buildFileManagerPage=async ()=>{
  state.elements.container.innerHTML=""

  let fileExplorer=document.createElement("file-explorer")
  state.elements.container.append(fileExplorer)

  state.currentPage=pages.filemanager
}

export const buildGoalsPage=async ()=>{
  state.elements.container.innerHTML=""

  let goalsPage=document.createElement("goals-page")
  state.elements.container.append(goalsPage)

  state.currentPage=pages.goalspage
}

export const buildReportsPage=()=>{
  state.elements.container.innerHTML=""
    
  let reportsPage=document.createElement("reports-page")
  state.elements.container.append(reportsPage)

  state.currentPage=pages.reportspage
}


let navigation=document.querySelector("main-toolbar")
navigation.addEventListener(NAVIGATE,ev=>{
  let {route,rect}=ev.detail
  if(rect) updateView({route,clientX:rect.x+rect.width*.5,clientY:rect.y+rect.height*.5})
  else updateView({route})
})