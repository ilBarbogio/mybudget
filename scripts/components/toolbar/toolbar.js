import { state } from "data/state.js"
import { NAVIGATE, pages } from "variables"

const template=
`
  <style>@import url("./scripts/components/toolbar/toolbar.css")</style>
  <div class="backdrop"></div>
  <div class="strip">
    <button class="circle-button">
      <my-icon icon="calendar" size="3em" data-route="${pages.calendar}"></my-icon>
    </button>
    <button class="circle-button">
      <my-icon icon="star" size="3em" data-route="${pages.goalspage}"></my-icon>
    </button>
    <button class="circle-button">
      <my-icon icon="chart" size="3em" data-route="${pages.reportspage}"></my-icon>
    </button>
    <button class="circle-button">
      <my-icon icon="folder" size="3em" data-route="${pages.filemanager}"></my-icon>
    </button>
  </div>
  <div class="sensible-area"></div>
  
`
export class MainToolbar extends HTMLElement{
  // static observedAttributes=["open"]

  // set dragDistance(v){
  //   this.strip.style.top=`calc(var(--top-hidden) + calc(${Math.min(1,v/this.maxDragDistance)} * var(--top-drag-delta)))`
  // }

  set buttonsVisible(v){
    if(v) this.showButtons()
    else this.hideButtons()
  }

  constructor(){
    super()
  }

  connectedCallback(){
    state.toolbar=this
    
    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=template

    this.open=false
    this.area=this.shadow.querySelector(".sensible-area")
    this.backdrop=this.shadow.querySelector(".backdrop")
    this.strip=this.shadow.querySelector(".strip")
    this.buttons=this.strip.querySelectorAll("button.circle-button")
    for(let b of this.buttons) b.addEventListener("click",this.buttonClick)

    this.setupAreaListeners()
  }

  setupAreaListeners(){

    this.area.addEventListener("click",(ev)=>{
      if(this.open) this.hideButtons()
      else this.showButtons()
    })
  }

  showButtons=()=>{
    this.open=true
    this.area.style.display="none"
    this.strip.style.top=`var(--top-showing)`
    
    this.backdrop.classList.add("open")
    this.backdrop.addEventListener("pointerdown",this.hideButtons)

    for(let b of this.buttons){
      let icon=b.querySelector("my-icon")
      if(icon.dataset.route==state.currentPage) b.setAttribute("disabled",true)
      else b.removeAttribute("disabled")
    }
  }
  hideButtons=()=>{
    this.open=false
    this.area.style.display="block"
    this.strip.style.top=`var(--top-hidden)`
    
    this.backdrop.classList.remove("open")
    this.backdrop.removeEventListener("click",this.hideButtons)
  }
  
  buttonClick=(ev)=>{
    let route=ev.target.dataset.route
    if(!route) route=ev.target.querySelector("my-icon")?.dataset?.route
    
    if(route){
      let event=new CustomEvent(NAVIGATE,{detail:{route}})
      this.shadow.getRootNode().host.dispatchEvent(event)

      this.hideButtons()
    }
  }

  disconnectedCallback(){}
}