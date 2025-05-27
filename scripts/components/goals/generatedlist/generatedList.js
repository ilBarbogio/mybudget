import { state } from "data/state.js"

const template=`
  <style>@import url("./scripts/components/goals/generatedlist/generatedList.css")</style>
  <div class="container">
    
  </div>
`
export class GeneratedList extends HTMLElement{
  constructor(){
    super()
  }

  connectedCallback(){
    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=template

    this.container=this.shadow.querySelector(".container")
    
    this.generateRows()
  }

  generateRows(){
    this.container.innerHTML=""
    for(let p of state.planned){
      console.log(p)
      this.container.innerHTML+=`<span>${p.value} - ${p.cause}</span>`
    }
  }

  disconnectedCallback(){

  }
}