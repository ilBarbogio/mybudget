import { NAVIGATE, pages, state } from "../../variables.js"

const template=
`
  <style>@import url("./scripts/components/toolbar/toolbar.css")</style>
  <div class="backdrop"></div>
  <div class="strip">
    <div class="button" data-route="${pages.calendar}">C</div>
    <div class="button" data-route="${pages.filemanager}">F</div>
    <div class="button" data-route="${pages.categorymanager}">c</div>
    <div class="dove-tail">
      <div></div><div></div>
    </div>
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
    this.buttons=this.shadow.querySelectorAll(".button")
    for(let b of this.buttons) b.addEventListener("click",this.buttonClick)

    this.setupAreaListeners()
  }

  setupAreaListeners(){
    // this.dragging=false
    // this.dragStart=undefined
    // this.drangHandle=undefined
    // this.maxDragDistance=200
    // this.xTolerance=150

    // const dragOngoing=(ev)=>{
    //   if(this.dragging){
    //     let currentPoint=[ev.clientX,ev.clientY]
    //     let distX=Math.abs(this.dragStart[0]-currentPoint[0])
    //     let distY=Math.abs(this.dragStart[1]-currentPoint[1])
    //     if(distX<=this.xTolerance){
    //       this.dragDistance=distY
    //       if(distY>this.maxDragDistance) dragEnd(ev)
    //     }else dragEnd(ev)
    //   }
    // }
    // const dragEnd=(ev)=>{
    //   if(this.dragging){
    //     let endPoint=[ev.clientX,ev.clientY]
    //     let distX=Math.abs(this.dragStart[0]-endPoint[0])
    //     let distY=Math.abs(this.dragStart[1]-endPoint[1])
    //     if(distX<=this.xTolerance && distY>this.maxDragDistance) this.buttonsVisible=true
        
    //     this.dragging=false
    //     this.dragStart=undefined
    //     // this.dragDistance=0
  
    //     window.removeEventListener("pointermove",dragEnd)
    //     window.removeEventListener("pointerup",dragEnd)
    //     window.removeEventListener("pointercancel",dragEnd)}
    // }

    // this.area.addEventListener("pointerdown",(ev)=>{
    //   if(!this.dragging){
    //     this.dragging=true
    //     this.dragStart=[ev.clientX,ev.clientY]
    //     this.dragDistance=0

    //     window.addEventListener("pointermove",dragOngoing)
    //     window.addEventListener("pointerup",dragEnd)
    //     window.addEventListener("pointercancel",dragEnd)
    //   }
    // })

    this.area.addEventListener("click",(ev)=>{
      if(this.open) this.hideButtons()
        else this.showButtons()
    })
  }

  showButtons=()=>{
    console.log(state.currentPage)
    this.open=true
    this.area.style.display="none"
    this.strip.style.top=`var(--top-showing)`
    
    this.backdrop.classList.add("open")
    this.backdrop.addEventListener("pointerdown",this.hideButtons)

    for(let b of this.buttons){
      if(b.dataset.route==state.currentPage) b.classList.add("disabled")
      else b.classList.remove("disabled")
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
    let rect=ev.target.getBoundingClientRect()
    
    let event=new CustomEvent(NAVIGATE,{detail:{route,rect}})
    this.shadow.getRootNode().host.dispatchEvent(event)

    this.hideButtons()
  }

  disconnectedCallback(){}
}