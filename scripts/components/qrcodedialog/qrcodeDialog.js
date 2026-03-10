import {
  TOGGLE_QRCODE_DIALOG_EVENT,
} from "variables"

const template=
`
  <style>@import url("./scripts/components/qrcodedialog/qrcodeDialog.css")</style>
  <div class="container">
    <div class="input-container">
      <div class="first-row">Seleziona i record da trasferire</div>
      <div class="last-row">
        <button class="button close">
          <my-icon icon="close"></my-icon>
        </button>
      </div>
    </div>
  </div>
`
export class QrcodeDialog extends HTMLElement{

  constructor(){
    super()
  }

  connectedCallback(){
    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=template

    this.container=this.shadow.querySelector(".container")
    this.inputContainer=this.container.querySelector(".input-container")
    
    this.closeButton=this.container.querySelector(".button.close")

    this.setupListeners()
  }

  setupListeners(){
    window.addEventListener(TOGGLE_QRCODE_DIALOG_EVENT,(ev)=>{
      this.container.classList.toggle("open")
    })
    this.closeButton.addEventListener("click",(ev)=>{
      this.container.classList.toggle("open")
    })
  }


  close(){
    this.container.classList.remove("open")
  }
}
