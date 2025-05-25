import { downloadDataFile, parseDataFile } from "data/files.js"
import { state } from "data/state.js"
import { createRecordFile, listRecordFiles, readRecordFile, removeRecordFile } from "data/opfsdata.js"
import { buildCalendarPage } from "transitions"
import {
  ADD_PLANNED_ENTRY_EVENT,
  EVENT_ACTIONS
} from "variables"

const template=
`
  <style>@import url("./scripts/components/goals/goalsPage.css")</style>
  <div class="container">

    <div class="extremity-padder"></div>
    
    <div class="glass-card planned">
      <div class="header">Programmati</div>
      <div class="planned-list"></div>
      
      <button class="new-entry">
        <my-icon icon="add" color="black" size="6em 2em"></my-icon>
      </button>
      
    </div>

    <div class="glass-card goals">
      <div class="header">Obiettivi</div>
      <div class="goals-list"></div>
      <form class="goals-form">
        <button disabled class="load-button" type="button">
          <my-icon icon="add" color="black" size="6em 2em"></my-icon>
        </button>
      </form>
    </div>

    <div class="extremity-padder"></div>
    
    <dialog class="download-dialog">
      <div>Scegli un formato di file</div>
      <div class="dialog-actions">
        <button class="button json" data-format="json">JSON</button>
        <button class="button csv" data-format="csv">CSV</button>
        <button class="button cancel">
          <my-icon icon="close" size="4em 2em"></my-icon>
        </button>
      </div>
    </dialog>

    <dialog class="delete-dialog">
      <div class="text">Vuoi cancellare questo file?</div>
      <div class="dialog-actions">
        <button class="button confirm">
          <my-icon icon="check" size="4em 2em"></my-icon>
        </button>
        <button class="button cancel">
          <my-icon icon="close" size="4em 2em"></my-icon>
        </button>
      </div>
    </dialog>
  </div>
`
export class GoalsPage extends HTMLElement{
  constructor(){
    super()
    this.selectedForDownload=undefined
    this.selectedForDeletion=undefined
  }

  connectedCallback(){
    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=template

    this.goalsForm=this.shadow.querySelector("form.goals-form")
    this.goalsList=this.shadow.querySelector("div.goals-list")

    this.plannedForm=this.shadow.querySelector("form.planned-form")
    this.plannedList=this.shadow.querySelector("div.planned-list")
    
    this.newPlannedEntryButton=this.shadow.querySelector("button.new-entry")

    this.setupListeners()
  }

  setupListeners(){

    window.addEventListener(ADD_PLANNED_ENTRY_EVENT,(ev)=>{
      if(ev.detail.action==EVENT_ACTIONS.finalize) this.addPlannedEntry(ev.detail.record)
    })

    this.newPlannedEntryButton.addEventListener("click",()=>{
      let event=new CustomEvent(ADD_PLANNED_ENTRY_EVENT,{detail:{
        action:EVENT_ACTIONS.request
      }})
      window.dispatchEvent(event)
    })
    

    // this.uploadForm.addEventListener("submit",async(ev)=>{
    //   ev.preventDefault()
    //   let data=new FormData(this.uploadForm)
    //   let file=data.get("file")
    //   await parseDataFile(file)
    // })
  }

  addPlannedEntry(record){
    //react to new planne entry here, for visualization purposes
    console.log(record)
  }
}