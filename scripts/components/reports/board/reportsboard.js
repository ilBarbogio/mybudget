import { state } from "data/state.js"
const template=
`
  <style>@import url("./scripts/components/reports/board/reportsboard.css")</style>
  <canvas>
  </canvas>
`
export class ReportsBoard extends HTMLElement{
  static observedAttributes=["width","height"]

  constructor(){
    super()
  }

  connectedCallback(){
    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=template

    this.canvas=this.shadow.querySelector("canvas")
    this.ctx=this.canvas.getContext("2d")
    this.canvas.width=this.width
    this.canvas.height=this.height

    this.setupData()
  }

  setupData(){
    let records=state.records.map(el=>parseFloat(el.value))
    let min=Math.min(...records)
    let max=Math.max(...records)
    let ratio=(this.width*.5)/Math.max(Math.abs(min),Math.abs(max))*.9
    
    this.step=2
    if(records.length<100) this.step=12
    else if(records.length<200) this.step=6
    else if(records.length<400) this.step=3

    this.canvas.height=(records.length +2)*this.step
    this.ctx.translate(this.width*.5,this.step)

    this.ctx.strokeStyle="gray"
    this.ctx.setLineDash([4,4])
    this.ctx.beginPath()
    this.ctx.moveTo(0,0)
    this.ctx.lineTo(0,records.length*this.step)
    this.ctx.stroke()

    this.ctx.strokeStyle="white"
    this.ctx.setLineDash([])
    this.ctx.beginPath()
    this.ctx.moveTo(0,0)
    for(let [i,r] of records.entries()){
      this.ctx.lineTo(r*ratio,i*this.step)
    }
    this.ctx.stroke()

    // this.ctx.strokeStyle="red"
    // this.ctx.setLineDash([])
    // this.ctx.beginPath()
    // this.ctx.moveTo(0,0)
    // let total=0
    // for(let [i,r] of records.entries()){
    //   total+=r
    //   console.log(total)
    //   this.ctx.lineTo(total*ratio,i*this.step)
    // }
    // this.ctx.stroke()
  }

  setupListeners(){
   
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name){
      case "width":
        this.width=newValue
        break
      case "height":
        this.height=newValue
        break
      default: break
    }
  }
}