import { parseLegacyData } from "../../data/files.js"
import {
  ADD_ENTRY_EVENT, ADD_ENTRY_REQUEST_EVENT, ADD_ENTRY_CONFIRM_EVENT,
  UPDATE_ENTRY_EVENT, UPDATE_ENTRY_REQUEST_EVENT, UPDATE_ENTRY_CONFIRM_EVENT, UPLOADED_FILE_DATA_LEGACY
} from "../../variables.js"

const template=
`
  <style>@import url("./scripts/components/fileinput/fileInput.css")</style>
  <div class="container">
    <input class="file-input" type="file"/>
    <input class="legacy-checkbox" type="checkbox"/>
    <button class="save-button">save</button>
  </div>
`
export class FileInput extends HTMLElement{
  constructor(){
    super()
  }

  connectedCallback(){
    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=template

    this.container=this.shadow.querySelector(".container")
    this.fileInput=this.container.querySelector("input[type=file]")
    this.legacyCheckbox=this.container.querySelector("input.legacy-checkbox")
    this.saveButton=this.container.querySelector("button.save-button")

    this.uploadedData=undefined

    this.mounted=true

    this.setupListeners()
  }

  setupListeners(){
    this.fileInput.addEventListener("change",async(ev)=>{
      if(this.legacyCheckbox.checked){
        let file=this.fileInput.files[0]
        let textData=await file.text()
        let {user,year,data}=parseLegacyData(textData)
        this.uploadedData={user,year,data}
      }else{
        
      }
    },false)
    
    this.saveButton.addEventListener("click",(ev)=>{
      if(this.uploadedData){
        let event=new CustomEvent(UPLOADED_FILE_DATA_LEGACY,{detail:this.uploadedData})
        console.log(event)
        window.dispatchEvent(event)
      }
    })
  }

}