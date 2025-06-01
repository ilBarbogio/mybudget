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
    let records=state.records.sort((a,b)=>a.date>=b.date?1:-1)
    let recordMap=Map.groupBy(records,el=>el.date.split("-")[1])
    
    for(let k of recordMap.keys()){
      let entries=Map.groupBy(recordMap.get(k),el=>el.date)
      for(let kk of entries.keys()){
        let subentries=entries.get(kk)
        let dailyValue=subentries.reduce((acc,curr)=>acc+curr.value,0)
        entries.set(kk, dailyValue)
      }
      recordMap.set(k,entries)
    }
    
    let fullMap=new Map()
    let cumulated=0
    for(let [i,m] of (new Array(12)).entries()){
      let k=(i+1).toString().padStart(2,"0")
      if(recordMap.has(k)){
        let dayValues=recordMap.get(k).values().toArray()
        let dayProgr=(new Array(dayValues.length)).fill(0)
        dayValues.reduce((acc,curr,i)=>{
          dayProgr[i]=acc+curr
          return acc+curr
        },cumulated)
        cumulated=dayProgr[dayProgr.length-1]
        fullMap.set(i,{days:dayValues,progressives:dayProgr})
      }else fullMap.set(i,{days:[],progressives:[]})
    }

    

    records=records.map(el=>parseFloat(el.value))
    let progressive=(new Array(records.length)).fill(0)
    records.reduce((acc,curr,i)=>{
      progressive[i]=acc+curr
      return acc+curr
    },0)
    
    let min=Math.min(...progressive)
    let max=Math.max(...progressive)
    let ratio=(this.width*.5)/Math.max(Math.abs(min),Math.abs(max))*.9
    
    this.step=12
    // if(records.length<100) this.step=12
    // else if(records.length<200) this.step=6
    // else if(records.length<400) this.step=3

    this.canvas.height=300//(records.length +2)*this.step
    this.ctx.translate(this.width*.5,this.step)

    this.ctx.strokeStyle="gray"
    this.ctx.setLineDash([4,4])
    this.ctx.beginPath()
    this.ctx.moveTo(0,0)
    this.ctx.lineTo(0,records.length*this.step)
    this.ctx.stroke()

    let step=12
    let cursor=0
    for(let m of fullMap.keys()){
      this.ctx.strokeStyle="gray"
      this.ctx.setLineDash([4,4])
      this.ctx.beginPath()
      this.ctx.moveTo(-this.width*.5,cursor*step)
      this.ctx.lineTo(this.width*.5,cursor*step)
      this.ctx.stroke()

      this.ctx.font="10px Arial"
      this.ctx.fillStyle="white"
      this.ctx.fillText(`${(m+1).toString().padStart(2,"0")} / ${state.year}`,-this.width*.5+5,cursor*step-5)

      cursor++


      let {days,}=fullMap.get(m)
      if(days.length>0){
        for(let [i,d] of days.entries()){
          this.ctx.strokeStyle=d<0?"red":"green"
          this.ctx.setLineDash([])
          this.ctx.beginPath()
          this.ctx.moveTo(0,cursor*step)
          this.ctx.lineTo(d*ratio,cursor*step)
          this.ctx.stroke()

          cursor++
        }
      }
    }

    cursor=0
    let lastProgressive=0
    this.ctx.strokeStyle="white"
    this.ctx.setLineDash([])
    for(let m of fullMap.keys()){
      this.ctx.beginPath()
      this.ctx.moveTo(lastProgressive*ratio,cursor*step)
      cursor++
      this.ctx.lineTo(lastProgressive*ratio,cursor*step)
      this.ctx.stroke()

      let {days,progressives}=fullMap.get(m)
      if(progressives.length>0){
        this.ctx.beginPath()
        this.ctx.moveTo(lastProgressive*ratio,cursor*step)
        for(let p of progressives){
          this.ctx.lineTo(p*ratio,cursor*step)
          cursor++
        }
        this.ctx.lineTo(lastProgressive*ratio,cursor*step)
        this.ctx.stroke()
      }
    }
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