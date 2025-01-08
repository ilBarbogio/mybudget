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
        <my-icon class="sign button" size="2em" icon="subtract" color="red"></my-icon>
        <input class="number-input" type="number" min=0 step=.01/>
        <div class="category-display">
          <div></div>
        </div>
      </div>
      
      <input class="date-input" type="date"/>

      <textarea class="cause-input"></textarea>

      <div class="last-row">
        <my-icon class="save button" size="2em" icon="check"></my-icon>
        <my-icon class="close button" size="2em" icon="close"></my-icon>
      </div>
    </div>

    <div class="category-input" popover></div>

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
    this.signButton=this.inputContainer.querySelector("my-icon.sign.button")
    this.valueInput=this.inputContainer.querySelector("input.number-input")

    this.categoryDisplay=this.inputContainer.querySelector(".category-display")
    this.categoryInput=this.shadow.querySelector(".category-input")
    
    this.dateInput=this.inputContainer.querySelector("input[type=date]")
    this.textArea=this.inputContainer.querySelector("textarea")
    this.saveButton=this.inputContainer.querySelector("my-icon.save.button")
    this.closeButton=this.inputContainer.querySelector("my-icon.close.button")

    this._action=undefined
    this._sign=1
    this._category=undefined

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
      this.category=undefined
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
      this.category=ev.detail?.category
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


    this.categoryInput.addEventListener("click",(ev)=>{
      console.log(ev)
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
      this.categoryInput.hidePopover()
    })
    this.categoryDisplay.addEventListener("click",(ev)=>{
      this.categoryInput.togglePopover()
    })
    // for(let i of this.categoryIcons.children) i.addEventListener("click",(ev)=>{
    //   ev.stopPropagation()
    //   this.category=ev.target.dataset.icon
    //   this.categoryInput.classList.remove("open")
    // })
    // this.categoryClose.addEventListener("click",(ev)=>{
    //   ev.stopPropagation()
    //   this.categoryInput.classList.remove("open")
    // })
    // this.categoryDelete.addEventListener("click",(ev)=>{
    //   ev.stopPropagation()
    //   this.category=undefined
    //   this.categoryInput.classList.remove("open")
    // })

    this.saveButton.addEventListener("click",(ev)=>{
      let detail={
        value:this.value,
        date:this.dateInput.value,
        cause:this.textArea.value,
        category:this._category
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