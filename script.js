import { setupState, setupStateListeners, state } from "./scripts/data/state.js"
import { LOADED_DATA_FROM_FILE, LS_KEY_CURRENT_FILE, MONTH_HIGHLIGHTED, NAVIGATE, pageColors, pages, seasonColors } from "./scripts/variables.js"
import { buildCalendarPage, buildFileManagerPage, buildReportsPage, buildGoalsPage } from "./scripts/transitions.js"

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
  // state.container=document.getElementById("container")
  await setupState()

  setupStateListeners()

  if(state.currentFile){
    await buildCalendarPage()
    // await buildFileManagerPage()
    // await state.loadFile()
    // await buildReportsPage()
    // await buildGoalsPage()
  }else{
    await buildFileManagerPage()
  }

  //listen to visible month for background color changes
  window.addEventListener(MONTH_HIGHLIGHTED,(ev)=>{
    state.elements.container.style.backgroundColor=seasonColors[ev.detail].background
  })
  state.elements.toolbar.addEventListener(NAVIGATE,(ev)=>{
    if(ev?.detail?.route) state.elements.container.style.backgroundColor=pageColors[ev.detail.route]
  })
}

appSetup()



