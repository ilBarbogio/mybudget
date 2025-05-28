import {
  ADD_ENTRY_EVENT,
  UPDATE_ENTRY_EVENT,
  ADD_PLANNED_ENTRY_EVENT,
  UPDATE_PLANNED_ENTRY_EVENT,
  ADD_PROPOSED_ENTRY_EVENT,
  BROADCAST_PLANNED_UID,
  categories,
  EVENT_ACTIONS
} from "variables"

const template=
`
  <style>@import url("./scripts/components/recordinput/recordInput.css")</style>
  <div class="container">
    <div class="input-container">
      <form>

    
        <div class="first-row">
          <my-icon class="sign button" icon="subtract" color="red"></my-icon>
          <input class="number-input" type="number" name="value" min="0" step="0.01"/>
          <div class="category-display">
            <div></div>
          </div>
        </div>
        
        <div class="input-group entry hidden"> 
          <input class="date-input" type="date" name="date"/>
        </div>
        <div class="input-group planned hidden">
          <div>
            <label for="planned-frequency">daily:</label>
            <select name="planned-frequency">
              <option value="0">One shot</option>
              <option value="1">daily</option>
              <option value="2">weekly</option>
              <option value="3">monthly</option>
            </select>
          </div>
          <div>
            <label for="planned-start-date">Start:</label>
            <input disabled class="date-input" type="date" name="planned-start-date"/>
          <div>
          </div>
            <label for="planned-end-date">End:</label>
            <input disabled class="date-input" type="date" name="planned-end-date"/>
          </div>
          <div>
            <label for="planned-weekday">Week day:</label>
            <select disabled name="planned-weekday">
              <option value="1">lun</option>
              <option value="2">mar</option>
              <option value="3">mer</option>
              <option value="4">gio</option>
              <option value="5">ven</option>
              <option value="6">sab</option>
              <option value="0">dom</option>
            </select>

            <label for="planned-monthday">Day:</label>
            <select disabled name="planned-monthday">
              ${(new Array(31)).fill(0).map((el,i)=>"<option value="+i+">"+(i+1)+"</option>")}
            </select>
          </div>
        </div>

        <textarea class="cause-input" name="cause"></textarea>

        <div class="last-row">
          <button class="save button" type="submit">
            <my-icon icon="check"></my-icon>
          </button>
          <button class="close button" type="button">
            <my-icon icon="close"></my-icon>
          </button>
        </div>


      </form>
    </div>

    <dialog class="category-input"></dialog>

  </div>
`
export class RecordInput extends HTMLElement{
  get value(){
    if(this.valueInput) return this._sign*Math.abs(this.getInput("value").value)
  }

  set sign(s){
    this._sign=s
    this.setSignButton()
  }

  set action(v){
    this._action=v
    if(this.inputContainer){
      switch(v){
        case ADD_ENTRY_EVENT:
        case UPDATE_ENTRY_EVENT:
          this.inputContainer.querySelector(".input-group.entry").classList.remove("hidden")
          this.inputContainer.querySelector(".input-group.planned").classList.add("hidden")
          break
        case ADD_PLANNED_ENTRY_EVENT:
        case UPDATE_PLANNED_ENTRY_EVENT:
          this.inputContainer.querySelector(".input-group.entry").classList.add("hidden")
          this.inputContainer.querySelector(".input-group.planned").classList.remove("hidden")
          break
        default:
          this.inputContainer.querySelector(".input-group.entry").classList.add("hidden")
          this.inputContainer.querySelector(".input-group.planned").classList.add("hidden")
          break
      }
    }
  }
  get action(){ return this._action}

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
    this.form=this.container.querySelector("form")
    this.signButton=this.inputContainer.querySelector(".sign.button")
    
    this.categoryDisplay=this.inputContainer.querySelector(".category-display")
    this.categoryInput=this.shadow.querySelector(".category-input")
    
    this.closeButton=this.inputContainer.querySelector(".close.button")

    this.action=undefined
    this._sign=1
    this._category=undefined

    this._uid=undefined
    this.setSignButton()

    this.setupListeners()
  }

  setupListeners(){
    window.addEventListener(ADD_ENTRY_EVENT,(ev)=>{
      if(ev.detail.action==EVENT_ACTIONS.request){
        this.action=ADD_ENTRY_EVENT
        this._recordId=undefined
        this.getInput("value").value=0
        this.sign=1
        this.category=undefined
        let currentDate=new Date()
        this.getInput("date").value=`${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2,"0")}-${currentDate.getDate().toString().padStart(2,"0")}`
        this.getInput("cause").value=""
        this.container.classList.toggle("open")
      }else if(ev.detail.action==EVENT_ACTIONS.confirm){
        this.close()
      }
    })
    
    window.addEventListener(UPDATE_ENTRY_EVENT,(ev)=>{
      if(ev.detail.action==EVENT_ACTIONS.request){
        //this.dateInput.removeAttribute("disabled")
        this.action=UPDATE_ENTRY_EVENT
        this._recordId=ev.detail.record.id
        this.getInput("value").value=Math.abs(ev.detail.record.value)
        this.sign=ev.detail.record.value>=0?1:-1
        this.getInput("date").value=ev.detail.record.date
        this.getInput("cause").value=ev.detail.record.cause
        this.category=ev.detail.record?.category
        this.container.classList.toggle("open")
      }else if(ev.detail.action==EVENT_ACTIONS.confirm){
        this.close()
      }
    })

    window.addEventListener(ADD_PLANNED_ENTRY_EVENT,(ev)=>{
      if(ev.detail.action==EVENT_ACTIONS.request){
        this.action=ADD_PLANNED_ENTRY_EVENT
        this._recordId=undefined
        this.getInput("value").value=0
        this.sign=1
        this.category=undefined
        this.getInput("planned-frequency").value="0"
        this.setPlannedFrequency("0")
        this.getInput("cause").value=""
        this.container.classList.toggle("open")
      }else if(ev.detail.action==EVENT_ACTIONS.confirm){
        this.close()
      }
    })
    
    window.addEventListener(UPDATE_PLANNED_ENTRY_EVENT,(ev)=>{
      // const 

      if(ev.detail.action==EVENT_ACTIONS.request){
        this.action=UPDATE_PLANNED_ENTRY_EVENT
        this._recordId=ev.detail.record.id
        this.getInput("value").value=Math.abs(ev.detail.record.value)
        this.sign=ev.detail.record.value>=0?1:-1
        // this.getInput("date").value=ev.detail.record.date
        this.getInput("cause").value=ev.detail.record.cause
        this.category=ev.detail.record?.category
        this.container.classList.toggle("open")
        this.setupPlannedListeners()
      }else if(ev.detail.action==EVENT_ACTIONS.confirm){
        this.removePlannedListeners()
        this.close()
      }
    })

    window.addEventListener(ADD_PROPOSED_ENTRY_EVENT,(ev)=>{
      if(ev.detail.action==EVENT_ACTIONS.request){
        this._uid=ev.detail.uid
        this.action=ADD_ENTRY_EVENT
        this._recordId=undefined
        this.getInput("cause").value=ev.detail.record.cause
        this.category=ev.detail.record.category
        this.getInput("date").value=ev.detail.record.date
        this.sign=ev.detail.record.value>=0?1:-1
        this.getInput("value").value=Math.abs(ev.detail.record.value)
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

    this.getInput("value").addEventListener("focus",(ev)=>{
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

    this.form.addEventListener("submit",(ev)=>{
      ev.preventDefault()
      let data=Object.fromEntries(new FormData(ev.target))
      if(this.action==UPDATE_ENTRY_EVENT || this.action==ADD_ENTRY_EVENT){
        if(this._uid!==undefined){
          let uidEvent=new CustomEvent(BROADCAST_PLANNED_UID,{detail:this._uid})
          window.dispatchEvent(uidEvent)
        }
        this._uid=undefined
        let detail={
          action:EVENT_ACTIONS.confirm,
          record:{
            value:this._sign*Math.abs(data.value??0),
            date:data.date,
            cause:data.cause,
            category:this._category
          }
        }
        if(this.action==UPDATE_ENTRY_EVENT) detail.record.id=this._recordId
        let event=new CustomEvent(this.action,{detail})
        window.dispatchEvent(event)
      }else if(this.action==UPDATE_PLANNED_ENTRY_EVENT || this.action==ADD_PLANNED_ENTRY_EVENT){
        console.log("PLANNED ENTRY")
        let reference
        if(data["planned-frequency"]==2) reference=data["planned-weekday"]
        else if(data["planned-frequency"]==3) reference=data["planned-monthday"]
        let detail={
          action:EVENT_ACTIONS.confirm,
          plannedRecord:{
            value:this._sign*Math.abs(data.value??0),
            frequency:data["planned-frequency"],
            dates:[
              data["planned-start-date"],
              data["planned-end-date"]
            ],
            reference,
            cause:data.cause,
            category:this._category
          }
        }
        // if(this.action==UPDATE_PLANNED_ENTRY_EVENT) detail.record.id=this._recordId
        let event=new CustomEvent(this.action,{detail})
        window.dispatchEvent(event)
      }
    })
    this.closeButton.addEventListener("click",(ev)=>{
      this._uid=undefined
      this.close()
    })

    this.setupPlannedListeners()
  }

  setPlannedFrequency(ev){
    let currentDate=new Date()
    switch(typeof ev == "object"?ev.target.value:ev){
      case "0"://one shot
        this.getInput("planned-start-date").disabled=false
        this.getInput("planned-start-date").value=`${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2,"0")}-${currentDate.getDate().toString().padStart(2,"0")}`
        this.getInput("planned-end-date").disabled=true
        this.getInput("planned-end-date").value=""
        this.getInput("planned-weekday").disabled=true
        this.getInput("planned-monthday").disabled=true
        break
      case "1"://daily
        this.getInput("planned-start-date").disabled=false
        this.getInput("date").value=`${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2,"0")}-${currentDate.getDate().toString().padStart(2,"0")}`
        this.getInput("planned-end-date").disabled=false
        this.getInput("planned-end-date").value=""
        this.getInput("planned-weekday").disabled=true
        this.getInput("planned-monthday").disabled=true
        break
      case "2"://weekly
        this.getInput("planned-start-date").disabled=false
        this.getInput("date").value=`${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2,"0")}-${currentDate.getDate().toString().padStart(2,"0")}`
        this.getInput("planned-end-date").disabled=false
        this.getInput("planned-end-date").value=""
        this.getInput("planned-weekday").disabled=false
        this.getInput("planned-weekday").value=currentDate.getDay()
        this.getInput("planned-monthday").disabled=true
        break
      case "3"://monthly
        this.getInput("planned-start-date").disabled=false
        this.getInput("date").value=`${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2,"0")}-${currentDate.getDate().toString().padStart(2,"0")}`
        this.getInput("planned-end-date").disabled=false
        this.getInput("planned-end-date").value=""
        this.getInput("planned-weekday").disabled=true
        this.getInput("planned-monthday").disabled=false
        this.getInput("planned-monthday").value=currentDate.getMonth()
        break
    }
  }
  setupPlannedListeners(){
    const setFreq=(ev)=>{this.setPlannedFrequency(ev)}
    this.getInput("planned-frequency").addEventListener("input",setFreq)
  }
  
  getInput(name){
    return this.inputContainer.querySelector(`*[name=${name}]`)
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
    this.getInput("value").value=""
    this.getInput("date").value=""
    this.categoryInput.value=""
    this.getInput("cause").value=""
    this.isPositive=false
    this.container.classList.remove("open")
  }
}
