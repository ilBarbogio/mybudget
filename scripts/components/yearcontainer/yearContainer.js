import { state } from "../../variables.js"

const template=
`
  <style>@import url("./scripts/components/yearcontainer/yearContainer.css")</style>
  <div class="container">
  </div>
`
export class YearContainer extends HTMLElement{
  // static observedAttributes=["year"]

  set data(data){
    if(this.mounted) this.buildMonths(data)
  }

  constructor(){
    super()
  }

  connectedCallback(){
    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=template

    this.container=this.shadow.querySelector(".container")
    
    this.observer=new IntersectionObserver(this.catchMonth,{
      threshold:.80
    })

    this.mounted=true
  }

  setupListeners(){
  }

  catchMonth(entries){
    let visibleMonth=entries.find(el=>el.isIntersecting)
    if(visibleMonth){
      //console.log(visibleMonth.target.getAttribute("month"))
    }
  }

  // attributeChangedCallback(name, oldValue, newValue){
  //   switch(name){
  //     case "year":
  //       this.year=newValue
  //       if(this.mounted) this.updateMonths()
  //       break
  //     default: break
  //   }
  // }

  // updateMonths(){
  //   for(let m of this.container.children){
  //     m.setAttribute("year",this.year)
  //   }
  // }

  buildMonths(data){
    let groupedData=new Map()
    for(let r of data){
      let splitDate=r.date.split("-")
      let month=splitDate[1]
      if(!groupedData.has(month)) groupedData.set(month,{records:[r]})
      else groupedData.set(month,{records:[...groupedData.get(month).records,r]})
    }


    this.container.innerHTML=""
    let startPadder=document.createElement("div")
    startPadder.classList.add("extremity-padder")
    this.container.append(startPadder)
    for(let i=0;i<12;i++){
      let monthString=(i+1).toString().padStart(2,"0")
      let month=document.createElement("month-list")
      month.setAttribute("month",monthString)
      month.setAttribute("year",this.year)
      this.container.append(month)
      this.observer.observe(month)

      let records=groupedData.has(monthString)?groupedData.get(monthString).records:[]
      month.records=records
    }
    let endPadder=document.createElement("div")
    endPadder.classList.add("extremity-padder")
    this.container.append(endPadder)

    let currentMonthString=(new Date().getMonth()+1).toString().padStart(2,"0")
    let currentMonth=this.container.querySelector(`month-list[month="${currentMonthString}"]`)
    setTimeout(()=>{currentMonth.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},100)
  }

  disconnectedCallback(){
    this.observer.disconnect()
    this.remove()
    state.yearContainer=undefined
  }
}