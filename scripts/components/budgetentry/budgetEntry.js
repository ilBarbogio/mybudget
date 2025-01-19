import { dayDateFormat } from "../../utils.js"
import { categories, CURRENCY_SYMBOL, DELETE_ENTRY_EVENT, EVENT_ACTIONS, UPDATE_ENTRY_EVENT } from "../../variables.js"

const template=`
  <style>@import url("./scripts/components/budgetentry/budgetEntry.css")</style>
  <div class="container">
    <div class="date"></div>
    <div class="category"></div>
    <div class="category-popover" popover></div>
    <div class="value"></div>
    <div class="cause"></div>
    <div class="actions">
      <button class="button delete">
        <my-icon icon="trash"></my-icon>
      </button>
      <button class="button modify">
        <my-icon icon="edit"></my-icon>
      </button>
    </div>

    <dialog class="delete-dialog">
      <div>Vuoi cancellare questa voce?</div>
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
export class BudgetEntry extends HTMLElement{
  set data(data){
    this._id=data.id
    this._value=data.value
    this._cause=data.cause
    this._date=data.date
    this._category=data.category
    this.renderData()
  }

  set id(identity){
    this._id=identity
    this.setAttribute("id",`entry-${this._id}`)
  }
  get id(){return this._id}

  set value(val){
    this._value=val
    this.renderData()
  }
  set cause(cau){
    this._cause=cau
    this.renderData()
  }

  set date(dat){
    this._date=dat
    this.renderData()
  }
  get date(){ return this._date}

  set category(cat){
    this._category=cat
    
    // this.renderData()
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
    this.categoryDisplay=this.container.querySelector(".category")
    this.categoryPopover=this.container.querySelector(".category-popover")
    this.dateDisplay=this.container.querySelector(".date")
    this.actions=this.container.querySelector(".actions")
    this.deleteButton=this.container.querySelector(".button.delete")
    this.modifyButton=this.container.querySelector(".button.modify")

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
    this.modifyButton.addEventListener("click",(ev)=>{
      // const month=this._date.split("-")[1]
      let event=new CustomEvent(UPDATE_ENTRY_EVENT,{detail:{
        action:EVENT_ACTIONS.request,
        record:{
          id:this._id,
          value:this._value,
          cause:this._cause,
          category:this._category,
          date:this._date
        }
      }})
      window.dispatchEvent(event)
    })
    
    this.shadow.addEventListener("click",(ev)=>{
      if(window.innerWidth<400 && !ev.composedPath().find(el=>el.tagName?.toLowerCase()=="button")){
        this.causeDisplay.classList.toggle("hidden")
        this.actions.classList.toggle("visible")
      }
    })

    this.categoryPopover.addEventListener("click",ev=>{
      this.categoryPopover.hidePopover()
    })
    this.confirmButtonDeleteDialog.addEventListener("click",ev=>{
      const month=this._date.split("-")[1]
        let event=new CustomEvent(DELETE_ENTRY_EVENT,{detail:{
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
    if(this.dateDisplay){
      const {day,date}=dayDateFormat(this._date)
      this.dateDisplay.innerHTML=`<span>${day}</span><span>${date}</span>`
    }
  }

  disconnectedCallback(){

  }
}