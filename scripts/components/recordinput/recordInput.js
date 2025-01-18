import {
  ADD_ENTRY_EVENT,
  UPDATE_ENTRY_EVENT,
  categories,
  EVENT_ACTIONS
} from "../../variables.js"

const template=
`
  <style>@import url("./scripts/components/recordinput/recordInput.css")</style>
  <div class="container">
    <div class="input-container">
      <div class="first-row">
        <my-icon class="sign button" icon="subtract" color="red"></my-icon>
        <input class="number-input" type="number" min=0 step=.01/>
        <div class="category-display">
          <div></div>
        </div>
      </div>
      
      <input class="date-input" type="date"/>

      <textarea class="cause-input"></textarea>

      <div class="last-row">
        <button class="save button">
          <my-icon icon="check"></my-icon>
        </button>
        <button class="close button">
          <my-icon icon="close"></my-icon>
        </button>
      </div>
    </div>

    <dialog class="category-input"></dialog>

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

  set category(v){
    this._category=v
    let icon=categories.find(el=>el.id==this._category)
    this.categoryDisplay.innerHTML=`<my-icon size="2em" icon="${icon?icon.icon:"dots"}" color="black"></my-icon>`
    this.categoryInput.innerHTML=`<div>${(()=>{
      let options=[]
      for(let c of categories) options.push(`<my-icon data-icon="${c.id}" size="3em" color="${c.id==v?"blue":"black"}" icon="${c.icon}"></my-icon>`)
      return options.join("\n")
    })()}</div>`
  }

  constructor(){
    super()
  }

  connectedCallback(){
    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=template

    this.container=this.shadow.querySelector(".container")
    this.inputContainer=this.container.querySelector(".input-container")
    this.signButton=this.inputContainer.querySelector(".sign.button")
    this.valueInput=this.inputContainer.querySelector("input.number-input")

    this.categoryDisplay=this.inputContainer.querySelector(".category-display")
    this.categoryInput=this.shadow.querySelector(".category-input")
    
    this.dateInput=this.inputContainer.querySelector("input[type=date]")
    this.textArea=this.inputContainer.querySelector("textarea")
    this.saveButton=this.inputContainer.querySelector(".save.button")
    this.closeButton=this.inputContainer.querySelector(".close.button")

    this._action=undefined
    this._sign=1
    this._category=undefined

    this.mounted=true
    this.setSignButton()

    this.setupListeners()
  }

  setupListeners(){
    window.addEventListener(ADD_ENTRY_EVENT,(ev)=>{
      if(ev.detail.action==EVENT_ACTIONS.request){
        this._action=ADD_ENTRY_EVENT
        this._recordId=undefined
        this.value=0
        this.sign=1
        this.category=undefined
        let currentDate=new Date()
        this.dateInput.value=`${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2,"0")}-${currentDate.getDate().toString().padStart(2,"0")}`
        this.container.classList.toggle("open")
      }else if(ev.detail.action==EVENT_ACTIONS.confirm){
        this.close()
      }
    })
    
    window.addEventListener(UPDATE_ENTRY_EVENT,(ev)=>{
      if(ev.detail.action==EVENT_ACTIONS.request){
        this._action=UPDATE_ENTRY_EVENT
        this._recordId=ev.detail.record.id
        this.value=Math.abs(ev.detail.record.value)
        this.sign=ev.detail.record.value>=0?1:-1
        this.dateInput.value=ev.detail.record.date
        this.textArea.value=ev.detail.record.cause
        this.category=ev.detail.record?.category
        this.container.classList.toggle("open")
      }else if(ev.detail.action==EVENT_ACTIONS.confirm){
        this.close()
      }
    })

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


    this.categoryInput.addEventListener("click",(ev)=>{
      ev.stopPropagation()
      for(let t of ev.composedPath()){
        if(t.tagName && t.tagName.toLowerCase()=="my-icon"){
          if(t.dataset.icon==this._category){
            this.category=undefined
          }else{
            this.category=t.dataset.icon
          }
          break
        }
        if(t==ev.currentTarget) break
      }
      this.categoryInput.close()
    })
    this.categoryDisplay.addEventListener("click",(ev)=>{
      this.categoryInput.showModal()
    })

    this.saveButton.addEventListener("click",(ev)=>{
      let detail={
        action:EVENT_ACTIONS.confirm,
        record:{
          value:this.value,
          date:this.dateInput.value,
          cause:this.textArea.value,
          category:this._category
        }
      }
      if(this._action==UPDATE_ENTRY_EVENT) detail.record.id=this._recordId
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