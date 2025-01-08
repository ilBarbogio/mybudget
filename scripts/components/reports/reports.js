import { parseLegacyData } from "../../data/files.js"
import {
  ADD_ENTRY_EVENT, ADD_ENTRY_REQUEST_EVENT, ADD_ENTRY_CONFIRM_EVENT,
  UPDATE_ENTRY_EVENT, UPDATE_ENTRY_REQUEST_EVENT, UPDATE_ENTRY_CONFIRM_EVENT, UPLOADED_FILE_DATA_LEGACY
} from "../../variables.js"

const template=
`
  <style>@import url("./scripts/components/reports/reports.css")</style>
  <div class="container">
    PAGINA DI REPORT
  </div>
`
export class ReportsPage extends HTMLElement{
  constructor(){
    super()
  }

  connectedCallback(){
    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=template

    // this.container=this.shadow.querySelector(".container")
    // this.fileInput=this.container.querySelector("input[type=file]")
    
    this.mounted=true

    this.setupListeners()
  }

  setupListeners(){
    // this.fileInput.addEventListener("change",async(ev)=>{
    //   if(this.legacyCheckbox.checked){
    //     let file=this.fileInput.files[0]
    //     let textData=await file.text()
    //     let {user,year,data}=parseLegacyData(textData)
    //     this.uploadedData={user,year,data}
    //   }else{
        
    //   }
    // },false)
    
  }

}