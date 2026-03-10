import {
  
} from "variables"

const template=
`
  <style>@import url("./scripts/components/reports/reports.css")</style>
  <div class="container">
    <div class="glass-card">
      <div class="header">Report</div>
      <reports-list></reports-list>
    </div>
  </div>
`
export class ReportsPage extends HTMLElement{
  constructor(){
    super()
  }

  connectedCallback(){
    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=template

    this.card=this.shadow.querySelector(".glass-card")

    // this.graph=this.shadow.querySelector(".graph")
    // this.graph.innerHTML=`<reports-board width="${this.graph.getBoundingClientRect().width}" height="200"></reports-board>`
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