import { dayDateFormat } from "utils"
import { categories, CURRENCY_SYMBOL, DELETE_PLANNED_ENTRY_EVENT, EVENT_ACTIONS } from "variables"

const template=`
  <style>@import url("./scripts/components/goals/plannedentry/plannedEntry.css")</style>
  <div class="container">
    <div class="dates"></div>
    <div class="category"></div>
    <div class="category-popover" popover></div>
    <div class="frequency"></div>
    <div class="reference"></div>
    <div class="value"></div>
    <div class="cause"></div>
    <div class="actions">
      <button class="button delete">
        <my-icon icon="trash"></my-icon>
      </button>
      <!-- <button class="button modify">
        <my-icon icon="edit"></my-icon>
      </button> -->
    </div>

    <dialog class="delete-dialog">
      <div>Vuoi cancellare questa pianificazione?</div>
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
</div>
`
export class PlannedEntry extends HTMLElement{
  set data(data){
    this._id=data.id
    this._frequency=data.frequency
    this._reference=data.reference
    this._value=data.value
    this._cause=data.cause
    this._dates=data.dates
    this._category=data.category
    this.renderData()
  }

  set id(identity){
    this._id=identity
    this.setAttribute("id",`entry-${this._id}`)
  }
  get id(){return this._id}

  set frequency(freq){
    this._frequency=freq
    this.renderData()
  }
  set reference(ref){
    this._reference=ref
    this.renderData()
  }

  set value(val){
    this._value=val
    this.renderData()
  }
  set cause(cau){
    this._cause=cau
    this.renderData()
  }

  set dates(dat){
    this._dates=dat
    this.renderData()
  }
  get dates(){ return this._dates}

  set category(cat){
    this._category=cat
    this.renderData()
  }
  get category(){ return this._category}

  constructor(){
    super()
  }

  connectedCallback(){
    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=template

    this.container=this.shadow.querySelector(".container")
    this.valueDisplay=this.container.querySelector(".value")
    this.causeDisplay=this.container.querySelector(".cause")
    this.frequencyDisplay=this.container.querySelector(".frequency")
    this.referenceDisplay=this.container.querySelector(".reference")
    this.categoryDisplay=this.container.querySelector(".category")
    this.categoryPopover=this.container.querySelector(".category-popover")
    this.datesDisplay=this.container.querySelector(".dates")
    this.actions=this.container.querySelector(".actions")
    this.deleteButton=this.container.querySelector(".button.delete")
    // this.modifyButton=this.container.querySelector(".button.modify")

    this.deleteDialog=this.container.querySelector("dialog.delete-dialog")
    this.confirmButtonDeleteDialog=this.deleteDialog.querySelector(".button.confirm")
    this.cancelButtonDeleteDialog=this.deleteDialog.querySelector(".button.cancel")

    this.mounted=true
    this.setupListeners()
    this.renderData()
  }

  setupListeners(){
    this.deleteButton.addEventListener("click",(ev)=>{
      this.deleteDialog.showModal()
    })
    // this.modifyButton.addEventListener("click",(ev)=>{
    //   // const month=this._dates.split("-")[1]
    //   let event=new CustomEvent(UPDATE_ENTRY_EVENT,{detail:{
    //     action:EVENT_ACTIONS.request,
    //     record:{
    //       id:this._id,
    //       value:this._value,
    //       cause:this._cause,
    //       category:this._category,
    //       dates:this._dates
    //     }
    //   }})
    //   window.dispatchEvent(event)
    // })
    
    this.shadow.addEventListener("click",(ev)=>{
      if(window.innerWidth<400 && !ev.composedPath().find(el=>el.tagName?.toLowerCase()=="button")){
        this.causeDisplay.classList.toggle("hidden")
        this.referenceDisplay.classList.toggle("hidden")
        this.actions.classList.toggle("visible")
      }
    })

    this.categoryPopover.addEventListener("click",ev=>{
      this.categoryPopover.hidePopover()
    })
    this.confirmButtonDeleteDialog.addEventListener("click",ev=>{
      let event=new CustomEvent(DELETE_PLANNED_ENTRY_EVENT,{detail:{
        action:EVENT_ACTIONS.confirm,
        id:this._id,
      }})
      window.dispatchEvent(event)
      this.deleteDialog.close()
    })
    this.cancelButtonDeleteDialog.addEventListener("click",ev=>{
      this.deleteDialog.close()
    })
  }

  renderData(){
    this.setAttribute("id",`entry-${this._id}`)

    if(this.datesDisplay){
      let start=this._dates[0]?this._dates[0].split("-").reverse().join("/"):undefined
      let end=this._dates[1]?this._dates[1].split("-").reverse().join("/"):undefined
      this.datesDisplay.innerHTML=""
      if(start!=undefined) this.datesDisplay.innerHTML+=`<span>${start}</span>`
      if(end!=undefined) this.datesDisplay.innerHTML+=`<span>${end}</span>`
    }
    if(this.datesDisplay && this.frequencyDisplay && this.referenceDisplay){
      let date
      switch(this._frequency){
        case "0":
          
          this.frequencyDisplay.innerHTML="Una tantum"
          this.referenceDisplay.innerHTML=""
          break
        case "1":
          this.frequencyDisplay.innerHTML="Quotidiana"
          this.referenceDisplay.innerHTML=""
          break
        case "2":
          this.frequencyDisplay.innerHTML="Settimanale"
          date=new Date()
          let weekDayDelta=date.getDay()-this._reference
          date.setDate(date.getDate()-weekDayDelta)
          this.referenceDisplay.innerHTML=`${dayDateFormat(date).day}`
          break
        case "3":
          this.frequencyDisplay.innerHTML="Mensile"
          this.referenceDisplay.innerHTML=`${this._reference}`
          break
        default:
          this.frequencyDisplay.innerHTML=""
          this.referenceDisplay.innerHTML=""
          break
      }
      
    }


    if(this.valueDisplay) this.valueDisplay.innerHTML=`${this._value} ${CURRENCY_SYMBOL}`
    if(this.causeDisplay) this.causeDisplay.innerHTML=this._cause
    
    if(this.categoryDisplay){
      if(this._category!==undefined && this._category!=-1){
        let cat=categories.find(el=>el.id==this._category)
        let icon=cat?.icon
        if(icon){
          this.categoryDisplay.innerHTML=`<my-icon icon="${icon}" size="1em"></my-icon>`
        }else{
          this.categoryDisplay.innerHTML=this._category
        }
        this.categoryDisplay.hidden=false

        let label=cat?.label
        if(label){
          this.categoryPopover.setAttribute("disabled",true)
          this.categoryPopover.innerHTML=label
        }else{
          this.categoryPopover.setAttribute("disabled",false)
          this.categoryPopover.innerHTML=""
        }
      }else{
        this.categoryDisplay.innerHTML=""
        this.categoryDisplay.hidden=true
      }
      
    }
  }

  disconnectedCallback(){

  }
}