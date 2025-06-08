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



function generateFakeData(){
  let id=1
  let records=[]
  let randomDays=[1,3,5,6,7,9,12,14,15,16,18,19,20,21,25,26,28]
  let randomWords=["ciao bischero","una cosa a caso","motivazione random","causa random perchè serve","speca ics","spesa ipsilon","guadagno random","trovati per terra"]

  let month=1
  while(month<8){
    let i=Math.floor(Math.random()*5)
    while(i<randomDays.length){
      records.push({
        id,
        value:Math.floor(Math.random()*200-100),
        cause:randomWords[Math.floor(Math.random()*randomWords.length)],
        date:`2025-${month.toString().padStart(2,"0")}-${randomDays[i].toString().padStart(2,"0")}`
      })
      id++
      if(Math.random()>=.02) i+=Math.floor(Math.random()*3)
    }
    month++
  }

  console.log(JSON.stringify(records))
}
// generateFakeData()
