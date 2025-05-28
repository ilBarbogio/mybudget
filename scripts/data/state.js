import {
	LS_KEY_CURRENT_FILE,
	ADD_ENTRY_EVENT,
	UPDATE_ENTRY_EVENT,
	DELETE_ENTRY_EVENT,
	ADD_PLANNED_ENTRY_EVENT,
	DELETE_PLANNED_ENTRY_EVENT,
	EVENT_ACTIONS
} from "variables"
import { addPlannedEntry, getPlannedEntries } from "data/localdata.js"
import { listRecordFiles, readRecordFile, writeRecordFile } from "data/opfsdata.js"

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

export const defaultData={
	user:undefined,
	year:undefined,
	records:[],
	planned:[],
	goals:[],
}

class State{
	get user(){ return this._data.user}
	set user(el){ this._data.user=el}
	get year(){ return this._data.year}
	set year(el){ this._data.year=el}

	get records(){ return this._data.records}
	set records(el){ this._data.records=el}
	get planned(){ return this._data.planned}
	set planned(el){ this._data.planned=el}
	get goals(){ return this._data.goals}
	set goals(el){ this._data.goals=el}

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
		this._data={...defaultData}
		this._maxId=undefined,
		this._maxPlannedId=undefined,
		this._maxGoalsId=undefined,
		this._currentFile=undefined
		this._availableFiles=[]
		this._currentPage=undefined//"calendar"|"filemanager"|"reports"|"goals"
	}

	updateMaxIds=()=>{
		this._maxId=0
		for(let r of this._data.records) this._maxId=Math.max(this._maxId,r.id)
		this._maxPlannedId=0
		for(let r of this._data.planned) this._maxPlannedId=Math.max(this._maxPlannedId,r.id)
		this._maxGoalsId=0
		for(let r of this._data.goals) this._maxGoalsId=Math.max(this._maxGoalsId,r.id)
	}

	loadFile=async (filename)=>{
		try{
			let res=await readRecordFile(filename??this._currentFile)
			if(!res.result) throw("Problem loading the current file")
			else{
				state.data={...defaultData,...res.data}
				this.updateMaxIds()
				return{result:true}
			}
		}catch(err){ return {result:false,message:err}}
	}

	/**
	 * Add a budget entry
	 * @param {{id?:number, value:number, date:string, cause:string, category:number}} record 
	 * @returns 
	 */
	addRecord=async (record)=>{
		record.id=this._maxId+1
		this._data.records.push(record)
		this.updateMaxIds()
		let result=await writeRecordFile(state._data.user,state._data.year,state._data.records,state._data.planned,state._data.goals)
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

	/**
	 * 
	 * @param {{id?:number, value:number, cause:number, category:number, frequency:"0"|"1"|"2"|"3", dates:string[]}} plannedRecord 
	 * @returns 
	 */
	addPlannedEntry=async (plannedRecord)=>{
		plannedRecord.id=this._maxPlannedId+1
		this._data.planned.push(plannedRecord)
		this.updateMaxIds()
		let result=await writeRecordFile(state._data.user,state._data.year,state._data.records,state._data.planned,state._data.goals)
		return {...result,plannedRecord}
	}
	updatePlannedEntry=async (plannedRecord)=>{
		let index=state._data.planned.findIndex(el=>el.id==plannedRecord.id)
		if(index>=0){
			state._data.planned[index]={...plannedRecord}
			let result=await writeRecordFile(state._data.user,state._data.year,state._data.records,state._data.planned,state._data.goals)
			return {...result,plannedRecord}
		}else return {result:false}
	}
	removePlannedEntry=async (id)=>{
		let index=state._data.planned.findIndex(el=>el.id==id)
		if(index>=0){
			state._data.planned.splice(index,1)
			let result=await writeRecordFile(state._data.user,state._data.year,state._data.records,state._data.planned,state._data.goals)
			return {...result,id}
		}else return {result:false}
	}


	addGoalEntry=async (goalRecord)=>{
		goalRecord.id=this._maxPlannedId+1
		this._data.goals.push(goalRecord)
		this.updateMaxIds()
		let result=await writeRecordFile(state._data.user,state._data.year,state._data.records,state._data.goals,state._data.goals)
		return {...result,goalRecord}
	}
	updateGoalEntry=async (goalRecord)=>{
		let index=state._data.goals.findIndex(el=>el.id==goalRecord.id)
		if(index>=0){
			state._data.goals[index]={...goalRecord}
			let result=await writeRecordFile(state._data.user,state._data.year,state._data.records,state._data.goals,state._data.goals)
			return {...result,goalRecord}
		}else return {result:false}
	}
	removeGoalEntry=async (id)=>{
		let index=state._data.goals.findIndex(el=>el.id==id)
		if(index>=0){
			state._data.goals.splice(index,1)
			let result=await writeRecordFile(state._data.user,state._data.year,state._data.records,state._data.goals,state._data.goals)
			return {...result,id}
		}else return {result:false}
	}
}

export const state=new State()

export const setupState=async ()=>{
	state.currentFile=localStorage.getItem(LS_KEY_CURRENT_FILE)
	state.data={...defaultData}

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
			console.log(ev.detail)
			let response=await state.addPlannedEntry(ev.detail.plannedRecord)
			if(response.result){
				let event=new CustomEvent(ADD_PLANNED_ENTRY_EVENT,{detail:{action:EVENT_ACTIONS.finalize,record:response.record}})
				window.dispatchEvent(event)
			}else{
				console.error("Add entry error")
			}
		}
  })
  window.addEventListener(DELETE_PLANNED_ENTRY_EVENT,async(ev)=>{
		console.log(ev,ev.detail.action==EVENT_ACTIONS.confirm)
		if(ev.detail.action==EVENT_ACTIONS.confirm){
			let response=await state.removePlannedEntry(ev.detail.id)
			if(response.result){
			let event=new CustomEvent(DELETE_PLANNED_ENTRY_EVENT,{detail:{action:EVENT_ACTIONS.finalize,id:response.id}})
			window.dispatchEvent(event)
			}else{
			console.error("Remove planned entry")
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