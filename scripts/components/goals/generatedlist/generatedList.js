import { state } from "data/state.js"
import { dayDateFormat, dateToYYYYMMDD } from "utils"
import {
  plannedLookaround, categories,
  ADD_PLANNED_ENTRY_EVENT, DELETE_PLANNED_ENTRY_EVENT, ADD_PROPOSED_ENTRY_EVENT, BROADCAST_PLANNED_UID, EVENT_ACTIONS,
  CURRENCY_SYMBOL, LS_KEY_ACCEPTED_ENTRIES
} from "variables"


const template=`
  <style>@import url("./scripts/components/goals/generatedlist/generatedList.css")</style>
  <div class="container">
    
  </div>
`
export class GeneratedList extends HTMLElement{
  constructor(){
    super()
  }

  connectedCallback(){
    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=template

    this.container=this.shadow.querySelector(".container")

    window.addEventListener(BROADCAST_PLANNED_UID,(ev)=>{
      this.addAcceptedPlanned(ev.detail)
      this.generateRows()
    })
    window.addEventListener(ADD_PLANNED_ENTRY_EVENT,(ev)=>{
      if(ev.detail.action==EVENT_ACTIONS.finalize) this.generateRows()
    })
    window.addEventListener(DELETE_PLANNED_ENTRY_EVENT,(ev)=>{
      if(ev.detail.action==EVENT_ACTIONS.finalize) this.generateRows()
    })
    
    this.generateRows()
  }

  addAcceptedPlanned(uid){
    let storedProposed=localStorage.getItem(LS_KEY_ACCEPTED_ENTRIES)
    if(storedProposed==null){
      localStorage.setItem(LS_KEY_ACCEPTED_ENTRIES,JSON.stringify([uid]))
    }else{
      storedProposed=JSON.parse(storedProposed)
      storedProposed.push(uid)
      localStorage.setItem(LS_KEY_ACCEPTED_ENTRIES,JSON.stringify(storedProposed))
    }
  }
  cleanAcceptedPlannned(start,end){

  }

  generateRows(){
    this.container.innerHTML=""
    for(let p of state.planned){
      let start=p.dates[0]??`${state.year}-01-01`
      let end=p.dates[1]??`${state.year}-12-31`
      
      let backDate=new Date()
      backDate.setDate(backDate.getDate()-plannedLookaround)
      backDate=dateToYYYYMMDD(backDate)
      let forDate=new Date()
      forDate.setDate(forDate.getDate()+plannedLookaround)
      forDate=dateToYYYYMMDD(forDate)

      start=[start,backDate].filter(el=>el!="").sort()[1]
      end=[end,forDate].filter(el=>el!="").sort()[0]
      
      const dates=this.generateDates(p.frequency,p.frequency=="0"?p.dates[0]:p.reference,start,end)
      const disabled=[]

      this.cleanAcceptedPlannned(start,end)
      let storedProposed=localStorage.getItem(LS_KEY_ACCEPTED_ENTRIES)
      if(storedProposed!=null){
        storedProposed=JSON.parse(storedProposed)
        for(let d of dates){
          if(storedProposed.includes(`${p.id}|${d}`)) disabled.push(true)
          else disabled.push(false)
        }
      }

      for(let [i,d] of dates.entries()) this.container.append(this.generateEntry(disabled[i],d,p.value,p.category,p.cause,p.id))
      
    }
  }

  generateDates(frequency,reference,start,end){
    if(frequency==0){
      return [reference]
    }

    const advance=(ymd,delta,type="day")=>{
      let d=new Date(ymd)
      if(type=="day") d.setDate(d.getDate()+delta)
      else d.setMonth(d.getMonth()+1)
      return dateToYYYYMMDD(d)
    }

    let cursor
    let dates=[]
    switch(frequency){
      case "1"://daily
      cursor=start
        while(cursor<=end){
          dates.push(cursor)
          cursor=advance(cursor,1)
        }
        break
      case "2"://weekly
        cursor=start
        while(cursor<=end){
          let weekday=(new Date(cursor)).getDay()
          if(weekday==reference){
            break
          }else cursor=advance(cursor,1)
        }
        while(cursor<=end){
          dates.push(cursor)
          cursor=advance(cursor,7)
        }
        break
      case "3"://monthly
        cursor=start
        cursor=(new Date(cursor))
        // console.log(cursor)
        cursor.setDate(parseInt(reference))
        // console.log(reference,cursor)
        if(cursor.getTime()>(new Date(start)).getTime()) cursor.setTime(cursor.getTime()-30*24*3600*1000)
        // console.log(cursor)
          cursor=dateToYYYYMMDD(cursor)
        while(cursor<=end){
          dates.push(cursor)
          cursor=advance(cursor,1,"month")
        }
        break
      default: break
    }
    return dates
  }

  generateEntry(disabled,propDate,value,category,cause,plannedId){
    const entry=document.createElement("div")
    entry.classList.add("entry")

    const entryDate=document.createElement("div")
    entryDate.classList.add("date")
    const {day,date}=dayDateFormat(propDate)
    entryDate.innerHTML=`<span>${day}</span><span>${date}</span>`
    entry.append(entryDate)

    const entryCategory=document.createElement("div")
    entryCategory.classList.add("category")
    let cat=categories.find(el=>el.id==category)
    let icon=cat?.icon
    if(icon) entryCategory.innerHTML=`<my-icon icon="${icon}" size="1em"></my-icon>`
    else entryCategory.innerHTML=""
    entry.append(entryCategory)

    const entryValue=document.createElement("div")
    entryValue.classList.add("value")
    entryValue.innerHTML=`${value} ${CURRENCY_SYMBOL}`
    entry.append(entryValue)

    const entryCause=document.createElement("div")
    entryCause.classList.add("cause")
    entryCause.innerHTML=cause
    entry.append(entryCause)

    const entryActions=document.createElement("div")
    entryActions.classList.add("actions")
    const actionButton=document.createElement("button")
    actionButton.classList.add("button","add")
    actionButton.innerHTML=`<my-icon icon="check"></my-icon>`
    if(disabled) actionButton.disabled=true
    else actionButton.addEventListener("click",()=>{
      let event=new CustomEvent(ADD_PROPOSED_ENTRY_EVENT,{detail:{
        uid:`${plannedId}|${propDate}`,
        action:EVENT_ACTIONS.request,
        record:{
          value:value,
          cause:cause,
          category:category,
          date:propDate,
        }
      }})
      window.dispatchEvent(event)
    })
    entryActions.append(actionButton)
    entry.append(entryActions)

    return entry
  }

  disconnectedCallback(){

  }
}