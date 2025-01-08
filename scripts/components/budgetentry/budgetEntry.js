import { dayDateFormat } from "../../utils.js"
import { categories, CURRENCY_SYMBOL, UPDATE_ENTRY_REQUEST_EVENT } from "../../variables.js"

const template=`
  <style>@import url("./scripts/components/budgetentry/budgetEntry.css")</style>
  <div class="container">
    <div class="date"></div>
    <div class="category"></div>
    <div class="category-popover" popover>
      <div></div>
    </div>
    <div class="value"></div>
    <div class="cause"></div>
    <div class="actions">
      <my-icon class="button delete" size="2em" icon="trash"></my-icon>
      <my-icon class="button modify" size="2em" icon="edit"></my-icon>
    </div>
    <div class="delete-popover" popover="manual">
      <div>
        <div>Vuoi cancellare questa voce?</div>
        <div class="actions">
          <my-icon class="button confirm" size="2em" icon="check"></my-icon>
          <my-icon class="button cancel" size="2em" icon="close"></my-icon>
        </div>
      </div>
    </div>
  </div>
`
export class BudgetEntry extends HTMLElement{
  // static observedAttributes=["id","value","cause"]
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
    let label=categories.find(el=>el.id==cat)?.label??""
    if(this.categoryPopover){
      this.categoryPopover.querySelector("div").innerHTML=label
    }
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
    this.categoryDisplay=this.container.querySelector(".category")
    this.categoryPopover=this.container.querySelector(".category-popover")
    this.dateDisplay=this.container.querySelector(".date")
    this.actions=this.container.querySelector(".actions")
    this.deleteButton=this.container.querySelector(".button.delete")
    this.modifyButton=this.container.querySelector(".button.modify")

    this.deletePopover=this.container.querySelector(".delete-popover")
    this.confirmButtonPopover=this.container.querySelector(".delete-popover .button.confirm")
    this.cancelButtonPopover=this.container.querySelector(".delete-popover .button.cancel")

    this.mounted=true
    this.setupListeners()
    this.renderData()
  }

  setupListeners(){
    this.deleteButton.addEventListener("click",(ev)=>{
      this.deletePopover.showPopover()
    })
    this.modifyButton.addEventListener("click",(ev)=>{
      // const month=this._date.split("-")[1]
      let event=new CustomEvent(UPDATE_ENTRY_REQUEST_EVENT,{
        detail:{
          id:this._id,
          value:this._value,
          cause:this._cause,
          category:this._category,
          date:this._date
        }
      })
      window.dispatchEvent(event)
    })

    this.categoryDisplay.addEventListener("click",ev=>{
      if(!this.categoryPopover.disabled){
        // let rect=this.categoryDisplay.getBoundingClientRect()
        // this.categoryPopover.style.top=`calc(${rect.y}px - .5em)`
        // this.categoryPopover.style.left=`calc(${rect.right}px + .5em)`
        this.categoryPopover.showPopover()
      }
    })

    this.categoryPopover.addEventListener("click",ev=>{
      this.categoryPopover.hidePopover()
    })
    this.confirmButtonPopover.addEventListener("click",ev=>{
      const month=this._date.split("-")[1]
        let event=new CustomEvent("delete-entry",{
          detail:{
            id:this._id,
            value:this._value,
            cause:this._cause,
            category:this._category,
            month
          }
        })
        window.dispatchEvent(event)
      this.deletePopover.hidePopover()
    })
    this.cancelButtonPopover.addEventListener("click",ev=>{
      this.deletePopover.hidePopover()
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
          this.categoryPopover.querySelector("div").innerHTML=label
        }else{
          this.categoryPopover.setAttribute("disabled",false)
          this.categoryPopover.querySelector("div").innerHTML=""
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