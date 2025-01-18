import {
  
} from "../../variables.js"

const template=
`
  <style>@import url("./scripts/components/reports/reports.css")</style>
  <div class="container">
    <div class="glass-card">
      <div class="header">Report</div>
      <div class="graph">
        <canvas width=100 height=100></canvas>
      </div>
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
    console.log(this.card,this.card.getBoundingClientRect(),this.card.getClientRects())

    this.graph=this.shadow.querySelector(".graph")
    this.canvas=this.shadow.querySelector("canvas")
    setTimeout(() => {
      queueMicrotask
      this.getdims()
    },200)
  }

  getdims(){
    let s=getComputedStyle(this.graph)
    console.log(this.graph,s,s["width"])
  
    this.width=Math.floor(.9 * parseFloat(s.width))
    this.height=Math.floor(.7 * window.innerHeight)
    this.canvas.width=this.width
    this.canvas.height=this.height
  }

  setupListeners(){
    window.addEventListener("resize",()=>{
      console.log(this.graph.getBoundingClientRect())
    })
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