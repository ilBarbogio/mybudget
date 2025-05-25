import {
	LS_KEY_CURRENT_FILE,
	ADD_ENTRY_EVENT,
	UPDATE_ENTRY_EVENT,
	DELETE_ENTRY_EVENT,
	ADD_PLANNED_ENTRY_EVENT,
	EVENT_ACTIONS
} from "../variables.js"
import { addPlannedEntry } from "./localdata.js"
import { listRecordFiles, readRecordFile, writeRecordFile } from "./opfsdata.js"

/**
* @typedef {Object} Record
* @property {number} id 
* @property {string} cause 
* @property {number} category 
* @property {string} date 
*/

/**
* @type {Object} state
* @property {?HTMLElement} toolbar
* @property {?HTMLElement} container
* @property {Record[]} records
* @property {any} goals
* @property {number} maxId
* @property {string} user
* @property {string} year
* @property {?string} currentFile
* @property {?HTMLElement} yearContainer
* @property {string[]} availableFiles
* @property {"calendar" | "filemanager" | "reports"} currentPage
*/
class State{
	get user(){ return this._data.user}
	set user(el){ this._data.user=el}
	get year(){ return this._data.year}
	set year(el){ this._data.year=el}

	get records(){ return this._data.records}
	set records(el){ this._data.records=el}
	get records(){ return this._data.records}
	set records(el){ this._data.records=el}

	get currentFile(){ return this._currentFile}
	set currentFile(el){ this._currentFile=el}
	get currentPage(){ return this._currentPage}
	set currentPage(el){ this._currentPage=el}
	get availableFiles(){ return this._availableFiles}
	set availableFiles(el){ this._availableFiles=el}

	get data(){ return this._data}
	set data(value){
		this._data={...value}
	}

	constructor(){
		this.elements={
			container:undefined,
			toolbar:undefined,
			recordInput:undefined,
			yearContainer:undefined
		}
		this._data={
			user:undefined,
			year:undefined,
			records:[],
			goals:undefined,
		}
		this._maxId=undefined,
		this._currentFile=undefined
		this._availableFiles=[]
		this._currentPage=undefined//"calendar"|"filemanager"|"reports"
	}

	updateMaxId=()=>{
		this._maxId=0
		for(let r of this._data.records) this._maxId=Math.max(this._maxId,r.id)
	}

	loadFile=async (filename)=>{
		try{
			let res=await readRecordFile(filename??this._currentFile)
			if(!res.result) throw("Problem loading the current file")
			else{
				state.data={...res.data}
				this.updateMaxId()
				return{result:true}
			}
		}catch(err){ return {result:false,message:err}}
	}

	addRecord=async (record)=>{
		record.id=this._maxId+1
		this._data.records.push(record)
		this.updateMaxId()
		let result=await writeRecordFile(state._data.user,state._data.year,state._data.records,state._data.goals)
		return {...result,record}
	}
	updateRecord=async (record)=>{
		let index=state._data.records.findIndex(el=>el.id==record.id)
		if(index>=0){
			state._data.records[index]={...record}
			let result=await writeRecordFile(state._data.user,state._data.year,state._data.records,state._data.goals)
			return {...result,record}
		}else return {result:false}
	}
	removeRecord=async (id)=>{
		let index=state._data.records.findIndex(el=>el.id==id)
		if(index>=0){
			state._data.records.splice(index,1)
			let result=await writeRecordFile(state._data.user,state._data.year,state._data.records,state._data.goals)
			return {...result,id}
		}else return {result:false}
	}


	addPlannedEntry=async (record)=>{
		console.log(record)
		// record.id=this._maxId+1
		// this._data.records.push(record)
		// this.updateMaxId()
		// let result=await writeRecordFile(state._data.user,state._data.year,state._data.records,state._data.goals)
		// return {...result,record}
	}
	updatePlannedEntry=async (record)=>{
		// let index=state._data.records.findIndex(el=>el.id==record.id)
		// if(index>=0){
		// 	state._data.records[index]={...record}
		// 	let result=await writeRecordFile(state._data.user,state._data.year,state._data.records,state._data.goals)
		// 	return {...result,record}
		// }else return {result:false}
	}
	removePlannedEntry=async (id)=>{
		// let index=state._data.records.findIndex(el=>el.id==id)
		// if(index>=0){
		// 	state._data.records.splice(index,1)
		// 	let result=await writeRecordFile(state._data.user,state._data.year,state._data.records,state._data.goals)
		// 	return {...result,id}
		// }else return {result:false}
	}
}

export const state=new State()

export const setupState=async ()=>{
	state.currentFile=localStorage.getItem(LS_KEY_CURRENT_FILE)
	state.data={
		user:undefined,
		year:undefined,
		records:[],
		goals:undefined,
		// maxId:undefined,
	}

	state.elements={
		container:document.getElementById("container"),
		toolbar:document.querySelector("main-toolbar"),
		recordInput:document.querySelector("record-input"),
		yearContainer:undefined
	}

	let res=await listRecordFiles()
	if(res?.result) state.availableFiles=res.files
	else state.availableFiles=[]
}


export const setupStateListeners=()=>{
  window.addEventListener(ADD_ENTRY_EVENT,async(ev)=>{
		if(ev.detail.action==EVENT_ACTIONS.confirm){
			let response=await state.addRecord(ev.detail.record)
			if(response.result){
				let event=new CustomEvent(ADD_ENTRY_EVENT,{detail:{action:EVENT_ACTIONS.finalize,record:response.record}})
				window.dispatchEvent(event)
			}else{
				console.error("Add entry error")
			}
		}
  })
  window.addEventListener(UPDATE_ENTRY_EVENT,async(ev)=>{
		if(ev.detail.action==EVENT_ACTIONS.confirm){
			let response=await state.updateRecord(ev.detail.record)
			if(response.result){
				let event=new CustomEvent(UPDATE_ENTRY_EVENT,{detail:{action:EVENT_ACTIONS.finalize,record:response.record}})
				window.dispatchEvent(event)
			}else{
				console.log("Update entry error")
			}
		}
  })
  window.addEventListener(DELETE_ENTRY_EVENT,async(ev)=>{
		console.log(ev,ev.detail.action==EVENT_ACTIONS.confirm)
		if(ev.detail.action==EVENT_ACTIONS.confirm){
			let response=await state.removeRecord(ev.detail.id)
			if(response.result){
			let event=new CustomEvent(DELETE_ENTRY_EVENT,{detail:{action:EVENT_ACTIONS.finalize,id:response.id}})
			window.dispatchEvent(event)
			}else{
			console.error("Remove entry record")
			}
		}
  })

	window.addEventListener(ADD_PLANNED_ENTRY_EVENT,async(ev)=>{
		if(ev.detail.action==EVENT_ACTIONS.confirm){
			console.log("STATE add planned")
			let response=addPlannedEntry(ev.detail.record)
			if(response.result){
				let event=new CustomEvent(ADD_PLANNED_ENTRY_EVENT,{detail:{action:EVENT_ACTIONS.finalize,record:response.record}})
				window.dispatchEvent(event)
			}else{
				console.error("Add entry error")
			}
		}
  })

  // window.addEventListener(UPLOADED_FILE_DATA_LEGACY,async(ev)=>{
  //   let {user,year,data}=ev.detail
    // await createRecordFile(user,year,data,{version:1,legacyFile:true})
  // })

  // window.addEventListener(LOADED_DATA_FROM_FILE,()=>{
  //   console.log(state)
  // })
}

const resetState=()=>{
	state.records=undefined
	state.goals=undefined
	state.maxId=undefined
	state.user=undefined
	state.year=undefined
	state.currentFile=undefined
	state.availableFiles=[]
}