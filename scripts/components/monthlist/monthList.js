import { ADD_ENTRY_REQUEST_EVENT, ADD_ENTRY_CONFIRM_EVENT, DELETE_ENTRY_CONFIRM_EVENT, UPDATE_ENTRY_CONFIRM_EVENT } from "../../variables.js"

const sanitizeNumber=(value)=>{
  return Math.floor(value*100)/100
}
const template=
`
  <style>@import url("./scripts/components/monthlist/monthList.css")</style>
  <div class="container">
    <div class="header"></div>
    <div class="list"></div>
    <div class="spacer"></div>
    <div class="footer"></div>
    <div class="actions">
      <icon-button style="margin:.5em;" class="add-button" sides="4em 2em" icon="add"></icon-button>
    </div>
    <div class="spacer"></div>
  </div>
`
export class MonthList extends HTMLElement{
  static observedAttributes=["month","year"]

  set records(records){
    this._records=records
    this.buildRows()
    this.updateTotals()
  }
  constructor(){
    super()
    this.month
    this.year
  }

  connectedCallback(){
    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=template

    this.container=this.shadow.querySelector(".container")
    this.header=this.container.querySelector(".header")
    this.list=this.container.querySelector(".list")
    this.footer=this.container.querySelector(".footer")
    this.addButton=this.container.querySelector(".add-button")

    this.mounted=true
    this.setupListeners()
  }

  setupListeners(){
    window.addEventListener(DELETE_ENTRY_CONFIRM_EVENT,(ev)=>{
      this.deleteEntry(ev.detail.id)
    })
    window.addEventListener(ADD_ENTRY_CONFIRM_EVENT,(ev)=>{
      if(ev.detail.date.split("-")[1]==this.getAttribute("month")) this.addEntry(ev.detail)
    })
    window.addEventListener(UPDATE_ENTRY_CONFIRM_EVENT,(ev)=>{
      if(ev.detail.date.split("-")[1]==this.getAttribute("month")) this.updateEntry(ev.detail)
    })
    this.addButton.clickHandler=(ev)=>{
      const event=new CustomEvent(ADD_ENTRY_REQUEST_EVENT,{detail:{
        month:this.month
      }})
      window.dispatchEvent(event)
    }
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name){
      case "month":
        this.month=newValue
        break
      case "year":
        this.year=newValue
        break
      default: break
    }
  }

  buildRows(){
    let date=new Date(`${this.year}-${this.month}-01`)
    let monthName=date.toLocaleDateString("it",{month:"long"})
    this.header.innerHTML=monthName


    this.list.innerHTML=""
    if(this._records!=undefined && this._records.length>0){
      this.sortRecords()
      for(let r of this._records){
        let entry=document.createElement("budget-entry")
        entry.classList.add("entry")
        entry.data=r
        this.list.append(entry)
      }
    }else{
      let entry=document.createElement("div")
      entry.classList.add("entry")
      entry.innerHTML="Nessuna voce"
      this.list.append(entry)
    }
  }

  deleteEntry(id){
    this._records=this._records.filter(el=>el.id!=id)
    const element=this.list.querySelector(`.entry[id=entry-${id}]`)
    if(element){
      this.list.removeChild(element)
      this.updateTotals()
    }
  }

  addEntry(record){
    this._records.push(record)
    this.updateTotals()
    
    let entry=document.createElement("budget-entry")
    entry.classList.add("entry")
    entry.data=record

    let i=0
    while(i<this.list.children.length){
      if(this.list.children[i].date>record.date) break
      i++
    }
    if(i<this.list.children.length) this.list.children[i].insertAdjacentElement("beforebegin",entry)
    else this.list.append(entry)
    this.updateTotals()
  }
  updateEntry(record){
    const foundRecord=this._records.find(el=>el.id==record.id)
    const foundElement=this.list.querySelector(`[id=entry-${record.id}]`)
    if(foundRecord && foundElement){
      foundRecord.value=record.value
      foundElement.value=record.value
      foundElement.date=record.date
      foundElement.cause=record.cause
      foundElement.category=record.category
      this.updateTotals()
    }
  }

  sortRecords(){
    this._records.sort((a,b)=>{
      let dateA=new Date(a.date)
      let dateB=new Date(b.date)
      return dateA-dateB
    })
  }
  updateTotals(){
    let totals={positive:0,negative:0,total:0}
    if(this._records!=undefined && this._records.length>0){
      for(let r of this._records){
        let value=Number.parseFloat(r.value)
        if(value>0) totals.positive+=value
        else totals.negative+=value
        totals.total+=value
        totals={
          positive:sanitizeNumber(totals.positive),
          negative:sanitizeNumber(totals.negative),
          total:sanitizeNumber(totals.total),
        }
      }

      this.footer.innerHTML=`+: ${totals.positive}   -: ${totals.negative}   tot.: ${totals.total}`
    }else{
      this.footer.innerHTML=``
    }
  }

  disconnectedCallback(){
    this.remove()
  }
}