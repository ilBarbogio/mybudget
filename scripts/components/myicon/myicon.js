import { icons, categoryIcons } from "./iconVariables.js"

const template=
`
  <style>@import url("./scripts/components/myicon/myicon.css")</style>
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewbox="0 0 1000 1000" stroke="currentColor" fill="currentColor"></svg>
`
export class MyIcon extends HTMLElement{
  static observedAttributes=["icon","color","size"]

  constructor(){
    super()
  }

  connectedCallback(){
    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=template
    
    this.svg=this.shadow.querySelector("svg")    

    if(this.getAttribute("customStyle")) this.style=this.getAttribute("customStyle")
    
    this.applySize(this.getAttribute("size"))
    this.applyColor(this.getAttribute("color"))
    this.composeSvg(this.getAttribute("icon"))
    this.svg.style.opacity=1
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name){
      case "size":
        this.applySize(newValue)
        break
      case "icon":
        this.composeSvg(newValue)
        break
      case "color":
        this.applyColor(newValue)
        break
      default: break
    }
  }

  composeSvg(icon){
    let svgContent
    let translate=true
    if(icons.hasOwnProperty(icon)){
      svgContent=icons[icon]
    }else if(categoryIcons.hasOwnProperty(icon)){
      svgContent=categoryIcons[icon]
      translate=false
    }
    
    if(this.svg && svgContent){
      this.svg.innerHTML=svgContent
    }
  }

  applyColor(color){
    if(color && this.svg){
      this.svg.style.color=color
    }
  }

  applySize(size){
    if(!size) size="2em"
    if(size.includes(" ")) size=size.split(" ")
    else size=[size,size]
    this.style.width=size[0]
    this.style.height=size[1]
  }
}