import {
  ADD_ENTRY_EVENT, ADD_ENTRY_REQUEST_EVENT, ADD_ENTRY_CONFIRM_EVENT,
  UPDATE_ENTRY_EVENT, UPDATE_ENTRY_REQUEST_EVENT, UPDATE_ENTRY_CONFIRM_EVENT,
  categories
} from "../../variables.js"

const template=
`
  <style>@import url("./scripts/components/recordinput/recordInput.css")</style>
  <div class="container">
    <div class="input-container">
      <div class="first-row">
        <icon-button class="sign button" sides="2em" icon="subtract" color="red"></icon-button>
        <input class="number-input" type="number" min=0 step=.01/>
      </div>

      <select class="category-input">
        <option value=-1>Nessuna</option>
        ${(()=>{
          let options=[]
          for(let c of categories) options.push(`<option value="${c.id}">${c.label}</option>`)
          return options.join("\n")
        })()}
      </select>
      
      <input class="date-input" type="date"/>

      <textarea class="cause-input"></textarea>

      <div class="last-row">
        <icon-button class="save button" sides="2em 2em" icon="check"></icon-button>
        <icon-button class="close button" sides="2em 2em" icon="close"></icon-button>
      </div>
    </div>
  </div>
`
export class RecordInput extends HTMLElement{
  set value(v){
    this._value=v
    if(this.valueInput) this.valueInput.value=v
  }
  get value(){
    return this._sign*this._value
  }

  set sign(s){
    this._sign=s
    this.setSignButton()
  }

  constructor(){
    super()
  }

  connectedCallback(){
    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=template

    this.container=this.shadow.querySelector(".container")
    this.inputContainer=this.container.querySelector(".input-container")
    this.signButton=this.inputContainer.querySelector("icon-button.sign.button")
    this.valueInput=this.inputContainer.querySelector("input.number-input")
    this.categoryInput=this.inputContainer.querySelector("select.category-input")
    this.dateInput=this.inputContainer.querySelector("input[type=date]")
    this.textArea=this.inputContainer.querySelector("textarea")
    this.saveButton=this.inputContainer.querySelector("icon-button.save.button")
    this.closeButton=this.inputContainer.querySelector("icon-button.close.button")

    this._action=undefined
    this._sign=1

    this.mounted=true
    this.setSignButton()

    this.setupListeners()
  }

  setupListeners(){
    window.addEventListener(ADD_ENTRY_REQUEST_EVENT,(ev)=>{
      this._action=ADD_ENTRY_EVENT
      this._recordId=undefined
      this.value=0
      this.sign=1
      let currentDate=new Date()
      this.dateInput.value=`${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2,"0")}-${currentDate.getDate().toString().padStart(2,"0")}`
      this.container.classList.toggle("open")
    })
    window.addEventListener(UPDATE_ENTRY_REQUEST_EVENT,(ev)=>{
      console.log(ev.detail)
      this._action=UPDATE_ENTRY_EVENT
      this._recordId=ev.detail.id
      this.value=Math.abs(ev.detail.value)
      this.sign=ev.detail.value>=0?1:-1
      this.dateInput.value=ev.detail.date
      this.textArea.value=ev.detail.cause
      this.categoryInput.value=ev.detail.category??""
      this.container.classList.toggle("open")
    })
    window.addEventListener(ADD_ENTRY_CONFIRM_EVENT,()=>{this.close()})
    window.addEventListener(UPDATE_ENTRY_CONFIRM_EVENT,()=>{this.close()})
    this.container.addEventListener("click",(ev)=>{
      this.close()
    })
    this.inputContainer.addEventListener("click",(ev)=>{
      ev.stopPropagation()
    })

    this.signButton.addEventListener("click",(ev)=>{
      this.toggleSign()
    })
    this.valueInput.addEventListener("input",(ev)=>{
      this._value=Math.abs(ev.target.value)
    })
    this.valueInput.addEventListener("focus",(ev)=>{
      if(ev.target.value==0) ev.target.value=""
    })
    this.saveButton.addEventListener("click",(ev)=>{
      let detail={
        value:this.value,
        date:this.dateInput.value,
        cause:this.textArea.value,
        category:this.categoryInput.value
      }
      if(this._action==UPDATE_ENTRY_EVENT) detail.id=this._recordId
      let event=new CustomEvent(this._action,{detail})
      window.dispatchEvent(event)
    })
    this.closeButton.addEventListener("click",(ev)=>{
      this.close()
    })
  }


  setSignButton(){
    if(this._sign>0){
      this.signButton.setAttribute("icon","add")
      this.signButton.setAttribute("color","green")
      this.container.classList.add("positive")
      this.container.classList.remove("negative")
    }else{
      this.signButton.setAttribute("icon","subtract")
      this.signButton.setAttribute("color","red")
      this.container.classList.remove("positive")
      this.container.classList.add("negative")
    }
  }
  toggleSign(){
    this._sign*=-1
    this.setSignButton()
  }

  close(){
    this._recordId=undefined
    this.valueInput.value=""
    this.dateInput.value=""
    this.categoryInput.value=""
    this.textArea.value=""
    this.isPositive=false
    this.container.classList.remove("open")
  }
}