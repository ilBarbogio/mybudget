import { state, NAVIGATE, LS_KEY_CURRENT_FILE, LOADED_DATA_FROM_FILE, pages, categories } from "./variables.js"
import { readRecordFile } from "./data/opfsdata.js"

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
    case pages.categorymanager:
      buildDestination=buildCategoryManagerPage
      break
    default: break
  }
  const transition = document.startViewTransition(buildDestination)

  // if(ev.clientX!==undefined && ev.clientY!==undefined){
  //   const x = ev?.clientX ?? innerWidth / 2
  //   const y = ev?.clientY ?? innerHeight / 2
  //   // Get the distance to the furthest corner
  //   const endRadius = Math.hypot(
  //     Math.max(x, innerWidth - x),
  //     Math.max(y, innerHeight - y),
  //   )

  //   transition.ready.then(() => {
  //     // Animate the root's new view
  //     document.documentElement.animate(
  //       {
  //         clipPath: [
  //           `circle(0 at ${x}px ${y}px)`,
  //           `circle(${endRadius}px at ${x}px ${y}px)`,
  //         ],
  //       },
  //       {
  //         duration: 500,
  //         easing: "ease-in",
  //         // Specify which pseudo-element to animate
  //         pseudoElement: "::view-transition-new(root)",
  //       },
  //     )
  //   })
  // }
}

export const buildCalendarPage=async ()=>{
  let lastCurrentFile=localStorage.getItem(LS_KEY_CURRENT_FILE)
  if(lastCurrentFile){
    const response=await readRecordFile(lastCurrentFile)
    if(response.result){
      
      state.container.innerHTML=""
  
      state.yearContainer=document.createElement("year-container")
      state.yearContainer.classList.add("content")
      state.yearContainer.setAttribute("year",state.year)
      state.container.append(state.yearContainer)
      
      state.yearContainer.data=state.records

      state.currentPage=pages.calendar
    }
  }

  

  
}

export const buildFileManagerPage=async ()=>{
  state.container.innerHTML=""

  let fileExplorer=document.createElement("file-explorer")
  state.container.append(fileExplorer)

  state.currentPage=pages.filemanager
}

const buildCategoryManagerPage=()=>{
  if(state.container){
    state.container.innerHTML=""//UNMOUNT OPTIONS PAGE
    state.container.innerHTML=`
    <div sytle="width:100%; height:24em; background-color:black">
      ${(()=>{
        let options=[]
        for(let c of categories) options.push(`<p>${c.id} - ${c.label}</p>`)
        return options.join("\n")
      })()}
    </div>
    `

    state.currentPage=pages.categorymanager
  }
}


let navigation=document.querySelector("main-toolbar")
navigation.addEventListener(NAVIGATE,ev=>{
  let {route,rect}=ev.detail
  if(rect) updateView({route,clientX:rect.x+rect.width*.5,clientY:rect.y+rect.height*.5})
  else updateView({route})
})