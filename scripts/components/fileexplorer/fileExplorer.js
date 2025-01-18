import { downloadDataFile, parseDataFile } from "../../data/files.js"
import { state } from "../../data/state.js"
import { createRecordFile, listRecordFiles, readRecordFile, removeRecordFile } from "../../data/opfsdata.js"
import { buildCalendarPage } from "../../transitions.js"
import {
  LS_KEY_CURRENT_FILE,
  LOADED_DATA_FROM_FILE,
  UPLOADED_FILE_DATA_LEGACY
} from "../../variables.js"

const template=
`
  <style>@import url("./scripts/components/fileexplorer/fileExplorer.css")</style>
  <div class="container">
    <div class="glass-card file-list">
      <div class="header">File salvati</div>
      <div class="file-results"></div>
      <button class="load-button">
        <my-icon icon="refresh" color="black" size="4em 2em"></my-icon>
      </button>
    </div>
    <div class="glass-card file-creation">
      <div class="header">Gestione file</div>
      <div class="header sub">Crea file</div>
      <form id="create-form">
        <span>
          <input required name="user" type="text"/> __ <input required pattern="[0-9]+" maxLength=4 name="year" type="text"/>
        </span>
        <button type="submit" disabled>
          <my-icon icon="add" color="black" size="2em"></my-icon>
        </button>
      </form>
      
      <div class="header sub">Carica file</div>
      <form id="upload-form">
        <input name="file" type="file" accept=".json,.csv"/>
        <label for="file">Seleziona un file</label>
        <button type="submit" disabled>
          <my-icon icon="upload" color="black" size="2em"></my-icon>
        </button>
      </form>
    </div>
    
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
export class FileExplorer extends HTMLElement{
  constructor(){
    super()
    this.selectedForDownload=undefined
    this.selectedForDeletion=undefined
  }

  connectedCallback(){
    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=template

    this.container=this.shadow.querySelector(".container")
    this.list=this.container.querySelector("div.file-results")
    
    this.loadButton=this.container.querySelector("button.load-button")

    this.downloadDialog=this.container.querySelector(".download-dialog")
    this.downloadJSONButton=this.downloadDialog.querySelector(".button.json")
    this.downloadCSVButton=this.downloadDialog.querySelector(".button.csv")
    this.closeDownloadDialogButton=this.downloadDialog.querySelector(".button.cancel")

    this.deleteDialog=this.container.querySelector(".delete-dialog")
    this.confirmDeleteDialogButton=this.container.querySelector(".delete-dialog .button.confirm")
    this.closeDeleteDialogButton=this.container.querySelector(".delete-dialog .button.cancel")

    this.createForm=this.container.querySelector("#create-form")
    this.createNameInput=this.createForm.querySelector("input[name=user]")
    this.createYearInput=this.createForm.querySelector("input[name=year]")
    this.createFileButton=this.createForm.querySelector("button[type=submit]")

    this.uploadForm=this.container.querySelector("#upload-form")
    this.uploadFileInput=this.uploadForm.querySelector("input[type=file]")
    this.uploadFileLabel=this.uploadForm.querySelector("label[for=file]")
    this.uploadFileButton=this.uploadForm.querySelector("button[type=submit]")

    this.mounted=true

    this.loadFiles()

    this.setupListeners()
  }

  setupListeners(){
    this.loadButton.addEventListener("click",this.loadFiles)
    
    this.downloadJSONButton.addEventListener("click",()=>{this.downloadFile("json")})
    this.downloadCSVButton.addEventListener("click",()=>{this.downloadFile("csv")})
    this.closeDownloadDialogButton.addEventListener("click",(ev)=>{
      this.selectedForDownload=undefined
      this.downloadDialog.close()
    })

    this.confirmDeleteDialogButton.addEventListener("click",async (ev)=>{
      await removeRecordFile(this.selectedForDeletion)
      this.selectedForDeletion=undefined
      this.deleteDialog.close()
      this.loadFiles()
    })
    this.closeDeleteDialogButton.addEventListener("click",(ev)=>{
      this.deleteDialog.close()
    })

    this.createForm.addEventListener("submit",async(ev)=>{
      ev.preventDefault()
      let data=new FormData(this.createForm)
      let user=data.get("user")
      let year=data.get("year")

      if(state.availableFiles.find(el=>el==`${user}__${year}.json`)){
        alert("Un file con questo nome esiste già, cambia nome o cancella il file prima di salvarne uno uguale!")
      }else if(user && year){
        let response=await createRecordFile(user,year,[],[],{openAfterCreation:true})
        if(response.result) window.dispatchEvent(new CustomEvent(LOADED_DATA_FROM_FILE))
      }
      
      for(let el of this.createForm.querySelectorAll("input")) el.value=""
      this.createForm.querySelector("button[type=submit]").setAttribute("disabled",true)

      this.loadFiles()
    })

    this.createNameInput.addEventListener("input",(ev)=>{
      if(this.checkNameYear()) this.createFileButton.removeAttribute("disabled")
      else this.createFileButton.setAttribute("disabled",true)
    })
    this.createYearInput.addEventListener("input",(ev)=>{
      if(this.checkNameYear()) this.createFileButton.removeAttribute("disabled")
      else this.createFileButton.setAttribute("disabled",true)
    })


    this.uploadFileInput.addEventListener("change",(ev)=>{
      if(ev.target.files.length==0){
        this.uploadFileLabel.innerHTML="Seleziona un file"
        this.uploadFileButton.setAttribute("disabled",true)
      }else{
        this.uploadFileLabel.innerHTML=ev.target.files[0].name
        this.uploadFileButton.removeAttribute("disabled")
      }
    })

    this.uploadForm.addEventListener("submit",async(ev)=>{
      ev.preventDefault()
      let data=new FormData(this.uploadForm)
      let file=data.get("file")
      await parseDataFile(file)
    })
  }

  loadFiles=async ()=>{
    let res=await listRecordFiles()
    if(res.result) state.availableFiles=res.files

    this.list.innerHTML=""
    if(state.availableFiles.length==0) this.list.innerHTML=`<div class="no-files">Nessun file salvato</div>`
    else for(let f of state.availableFiles){
      let entry=document.createElement("div")
      entry.classList.add("entry")
      let text=document.createElement("span")
      if(f==state.currentFile) text.classList.add("selected")
      text.innerHTML=f
      entry.append(text)

      let loadButton=document.createElement("button")
      loadButton.classList.add("btn","close")
      if(f==state.currentFile) loadButton.setAttribute("disabled",true)
      loadButton.innerHTML=`<my-icon icon="calendar"></my-icon`
      loadButton.addEventListener("click",async()=>{
        localStorage.setItem(LS_KEY_CURRENT_FILE,f)
        state.currentFile=f
        await buildCalendarPage()
      })
      entry.append(loadButton)

      let downloadButton=document.createElement("button")
      downloadButton.classList.add("btn","close")
      downloadButton.innerHTML=`<my-icon icon="download"></my-icon>`
      downloadButton.addEventListener("click",async(ev)=>{
        this.selectedForDownload=f
        this.downloadDialog.showModal()
      })
      entry.append(downloadButton)
      
      let deleteButton=document.createElement("button")
      deleteButton.classList.add("btn","close")
      deleteButton.innerHTML=`<my-icon icon="trash"></my-icon>`
      deleteButton.addEventListener("click",async()=>{
        this.selectedForDeletion=f
        this.deleteDialog.querySelector("div.text").innerHTML=`Confermi la cancellazione di ${f}?`
        this.deleteDialog.showModal()
      })
      entry.append(deleteButton)
      this.list.append(entry)
    }
  }

  downloadFile=async (format)=>{
    let filename=this.selectedForDownload
    this.selectedForDownload=undefined
    let data=await downloadDataFile(filename,format)
    console.log(data,format)
    if(data){
      let blob=new Blob([data],{type:`text/${format}`})
      let url=URL.createObjectURL(blob)
      
      const link=document.createElement('a')
      link.href=url
      link.download=`${filename.replace(".json","").replace(".csv","")}.${format}`
      document.body.appendChild(link)
      link.click()

      link.remove()
      URL.revokeObjectURL(url) 
    }else alert("No data")
    this.downloadDialog.close() 
    
  }

  checkNameYear=()=>{
    if(
      this.createNameInput.value!="" &&
      !this.createNameInput.value.includes(".") &&
      !this.createNameInput.value.includes(",") &&
      !this.createNameInput.value.includes(" ") &&
      !this.createNameInput.value.includes("__") &&
      this.createYearInput.value!="" &&
      this.createYearInput.value.length==4 &&
      !isNaN(+this.createYearInput.value)
    ) return true
    else return false
  }
}