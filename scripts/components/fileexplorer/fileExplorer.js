import { parseLegacyData } from "../../data/files.js"
import { createRecordFile, listFiles, readRecordFile, removeRecordFile } from "../../data/opfsdata.js"
import {
  
  LOADED_DATA_FROM_FILE,
  UPLOADED_FILE_DATA_LEGACY, state
} from "../../variables.js"

const template=
`
  <style>@import url("./scripts/components/fileexplorer/fileExplorer.css")</style>
  <div class="container">
    <div class="glass-card file-list">
      <div class="header">File salvati</div>
      <div class="file-results"></div>
      <button class="load-button">load</button>
    </div>
    <div class="glass-card file-creation">
      <div class="header">Gestione file</div>
      <div class="header sub">Crea file</div>
      <form>
        <input name="user" type="text"/>
        <input name="year" type="text"/>
        <button type="submit">create</button>
      </form>
      
      <div class="header sub">Carica file</div>
      <file-input></file-input>
    </div>
    
  </div>
`
export class FileExplorer extends HTMLElement{
  constructor(){
    super()
  }

  connectedCallback(){
    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=template

    this.container=this.shadow.querySelector(".container")
    this.list=this.container.querySelector("div.file-results")
    
    this.loadButton=this.container.querySelector("button.load-button")

    this.form=this.container.querySelector("form")

    this.mounted=true

    this.loadFiles()

    this.setupListeners()
  }

  setupListeners(){
    this.loadButton.addEventListener("click",this.loadFiles)

    this.form.addEventListener("submit",async(ev)=>{
      ev.preventDefault()
      let data=new FormData(this.form)
      let user=data.get("user")
      let year=data.get("year")

      if(state.availableFiles.find(el=>el==`${user}__${year}.json`)){
        alert("Un file con questo nome esiste già, cambia nome o cancella il file prima di salvarne uno uguale!")
      }else if(user && year){
        let response=await createRecordFile(user,year,{records:[],goals:[]},{openAfter:true})
        if(response.result) window.dispatchEvent(new CustomEvent(LOADED_DATA_FROM_FILE))
      }
    })
  }

  loadFiles=async ()=>{
    await listFiles()
    console.log(state)
    this.list.innerHTML=""
    if(state.availableFiles.length==0) this.list.innerHTML=`<p>Nessun file salvato</p>`
    else for(let f of state.availableFiles){
      let entry=document.createElement("div")
      let text=document.createElement("span")
      text.innerHTML=f
      entry.append(text)

      let loadButton=document.createElement("my-icon")
      loadButton.classList.add("btn","close")
      loadButton.setAttribute("size","2em")
      loadButton.setAttribute("icon","dots")
      loadButton.addEventListener("click",async()=>{
        let response=await readRecordFile(f)
        console.log("RESULT  ",response)
        if(response.result){
          let event=new CustomEvent(LOADED_DATA_FROM_FILE)
          window.dispatchEvent(event)
        }
      })
      entry.append(loadButton)
      
      
      let deleteButton=document.createElement("my-icon")
      deleteButton.classList.add("btn","close")
      deleteButton.setAttribute("size","2em")
      deleteButton.setAttribute("icon","trash")
      deleteButton.addEventListener("click",async()=>{
        if(confirm("Remove for real?")) await removeRecordFile(f)
      })
      entry.append(deleteButton)
      this.list.append(entry)
    }
  }

}