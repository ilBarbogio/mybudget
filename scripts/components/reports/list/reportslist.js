import { state } from "data/state.js"
import { categories } from "../../../variables.js"

const template=
`
  <style>@import url("./scripts/components/reports/list/reportslist.css")</style>
  <div class="list"></div>
`
export class ReportsList extends HTMLElement{

  constructor(){
    super()
  }

  connectedCallback(){
    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=template

    this.list=this.shadow.querySelector(".list")

    this.chewData()
  }

  chewData(){
    let records=state.records.sort((a,b)=>a.date>=b.date?1:-1).map(el=>el.category ? el : {...el,category:-1})
    let recordMap=Map.groupBy(records,el=>el.category)

    let totals=[0,0]
    for(let k of recordMap.keys()){
      recordMap.set(k,recordMap.get(k).reduce((acc,curr,i)=>{
        if(curr.value>=0) totals[0]+=curr.value
        else totals[1]+=curr.value
        return curr.value>=0 ? [acc[0]+curr.value,acc[1]] : [acc[0],acc[1]+curr.value]
      },[0,0]))
    }

    this.list.innerHTML=`
    <div></div>
    <my-icon icon="add"></my-icon>
    <my-icon icon="subtract"></my-icon>
    `

    for(let k of recordMap.keys()){
      let icon=categories.find(el=>el.id==k)?.icon ?? "dots"
      let comp=document.createElement("my-icon")
      comp.setAttribute("icon",icon)

      this.list.append(comp)

      let pos=document.createElement("div")
      pos.className="value"
      pos.innerHTML=recordMap.get(k)[0]
      this.list.append(pos)

      let neg=document.createElement("div")
      neg.className="value"
      neg.innerHTML=recordMap.get(k)[1]
      this.list.append(neg)
    }

    let totComp=document.createElement("div")
    totComp.innerHTML=`tot.  ${totals[0]+totals[1]}`
    this.list.append(totComp)
    let posTotComp=document.createElement("div")
    posTotComp.className="value"
    posTotComp.innerHTML=totals[0]
    this.list.append(posTotComp)
    let negTotComp=document.createElement("div")
    negTotComp.className="value"
    negTotComp.innerHTML=totals[1]
    this.list.append(negTotComp)
    
    // let recordMap=Map.groupBy(records,el=>el.date.split("-")[1])
    
    // for(let k of recordMap.keys()){
    //   let entries=Map.groupBy(recordMap.get(k),el=>el.date)
    //   for(let kk of entries.keys()){
    //     let subentries=entries.get(kk)
    //     let dailyValue=subentries.reduce((acc,curr)=>acc+curr.value,0)
    //     entries.set(kk, dailyValue)
    //   }
    //   recordMap.set(k,entries)
    // }
    
    // let fullMap=new Map()
    // let cumulated=0
    // for(let [i,m] of (new Array(12)).entries()){
    //   let k=(i+1).toString().padStart(2,"0")
    //   if(recordMap.has(k)){
    //     let dayValues=recordMap.get(k).values().toArray()
    //     let dayProgr=(new Array(dayValues.length)).fill(0)
    //     dayValues.reduce((acc,curr,i)=>{
    //       dayProgr[i]=acc+curr
    //       return acc+curr
    //     },cumulated)
    //     cumulated=dayProgr[dayProgr.length-1]
    //     fullMap.set(i,{days:dayValues,progressives:dayProgr})
    //   }else fullMap.set(i,{days:[],progressives:[]})
    // }

    

    // records=records.map(el=>parseFloat(el.value))
    // let progressive=(new Array(records.length)).fill(0)
    // records.reduce((acc,curr,i)=>{
    //   progressive[i]=acc+curr
    //   return acc+curr
    // },0)
    // console.log(records)
    // let min=Math.min(...progressive)
    // let max=Math.max(...progressive)
    
  }

  setupListeners(){
   
  }

}