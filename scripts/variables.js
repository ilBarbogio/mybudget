export const APP_VERSION="01.00.00"

//EVENTS
//toggle calls
export const TOGGLE_SIDEBAR_EVENT="toggle-main-sidebar"
export const TOGGLE_RECORD_INPUT_EVENT="toggle-entry-input"

//action calls: request, act, confirm
export const ADD_ENTRY_EVENT="add-entry"
export const DELETE_ENTRY_EVENT="delete-entry"
export const UPDATE_ENTRY_EVENT="update-entry"

export const ADD_PLANNED_ENTRY_EVENT="add-planned-entry"
export const DELETE_PLANNED_ENTRY_EVENT="delete-planned-entry"
export const UPDATE_PLANNED_ENTRY_EVENT="update-planned-entry"
export const ADD_PROPOSED_ENTRY_EVENT="add-proposed-entry"
export const BROADCAST_PLANNED_UID="broadcast-planned-uid"


export const EVENT_ACTIONS={
  request:"request",
  act:"act",
  finalize:"finalize",
  confirm:"confirm",//for dialog results
  cancel:"cancel",//for dialog results
}

//file manager events
export const UPLOADED_FILE_DATA_LEGACY="uploaded-file-data-legacy"
export const LOADED_DATA_FROM_FILE="loaded-data-from-file"



//navigation events
export const NAVIGATE="navigation-event"

//calendar events
export const MONTH_HIGHLIGHTED="month-into-view"

//settings events
export const GRAPHIC_SETTINGS_EVENT="graphic-settings"


//KEYs
//local storage
export const LS_KEY_CURRENT_FILE="currentFile"

export const LS_KEY_PLANNED_ENTRIES="planneEntries"
export const LS_KEY_ACCEPTED_ENTRIES="acceptedProposedEntries"

export const LS_KEY_GRAPHICS="graphicLevel"


export const CURRENCY_SYMBOL="€"



export const categories=[
  {id:0, icon:"casa", label:"casa"},
  {id:1, icon:"spesa", label:"spesa"},
  {id:2, icon:"gatto", label:"animali"},
  {id:3, icon:"macchina", label:"auto"},
  {id:4, icon:"architettura", label:"arch. work"},
  {id:5, icon:"uscite", label:"tasse"},
  {id:6, icon:"banca", label:"banca"},
  {id:7, icon:"salute", label:"salute"},
  {id:8, icon:"hobby", label:"hobbies"},
  {id:9, icon:"viaggi", label:"vacanze"},
  {id:10, icon:"regali", label:"regali"},
  {id:11, icon:"curapersona", label:"cura persona"},
  {id:12, icon:"portafoglio", label:"portafoglio"},
  {id:13, icon:"cibo", label:"cibo fuori"},
  {id:14, icon:"entrate", label:"entrate"},
  {id:15, icon:"libri", label:"libri"},
  {id:16, icon:"vestiti", label:"vestiti"},
  {id:17, icon:"tecnologia", label:"tecnologia"},
  {id:18, icon:"maialino", label:"maialino"},
  {id:19, icon:"museo", label:"museo"},
]

export const pages={
  calendar:"calendar",
  filemanager:"filemanager",
  goalspage:"goalspage",
  reportspage:"reportspage",
  categorymanager:"categorymanager",
}


export const seasonColors=[
  {background:"skyblue"},
  {background:"skyblue"},

  {background:"mediumspringgreen"},
  {background:"mediumspringgreen"},
  {background:"mediumspringgreen"},

  {background:"#e53535"},
  {background:"#e53535"},
  {background:"#e53535"},

  {background:"gold"},
  {background:"gold"},
  {background:"gold"},

  {background:"skyblue"},
]

export const seasonGradients=[
  {background:"linear-gradient(356deg,rgba(135, 165, 235, 1) 0%, rgba(135, 206, 235, 1) 100%)"},
  {background:"linear-gradient(356deg,rgba(135, 165, 235, 1) 0%, rgba(135, 206, 235, 1) 100%)"},

  {background:"linear-gradient(356deg,rgba(0, 250, 12, 1) 0%, rgba(0, 250, 179, 1) 100%)"},
  {background:"linear-gradient(356deg,rgba(0, 250, 12, 1) 0%, rgba(0, 250, 179, 1) 100%)"},
  {background:"linear-gradient(356deg,rgba(0, 250, 12, 1) 0%, rgba(0, 250, 179, 1) 100%)"},

  {background:"#linear-gradient(356deg,rgba(229, 141, 53, 1) 0%, rgba(229, 53, 53, 1) 100%)"},
  {background:"#linear-gradient(356deg,rgba(229, 141, 53, 1) 0%, rgba(229, 53, 53, 1) 100%)"},
  {background:"#linear-gradient(356deg,rgba(229, 141, 53, 1) 0%, rgba(229, 53, 53, 1) 100%)"},

  {background:"linear-gradient(356deg,rgba(255, 215, 0, 1) 0%, rgba(255, 162, 0, 1) 100%)"},
  {background:"linear-gradient(356deg,rgba(255, 215, 0, 1) 0%, rgba(255, 162, 0, 1) 100%)"},
  {background:"linear-gradient(356deg,rgba(255, 215, 0, 1) 0%, rgba(255, 162, 0, 1) 100%)"},

  {background:"linear-gradient(356deg,rgba(135, 165, 235, 1) 0%, rgba(135, 206, 235, 1) 100%)"},
]

export const pageColors={
  [pages.filemanager]:"salmon",
  [pages.reportspage]:"slateblue",
  [pages.goalspage]:"lightgreen",
}

export const plannedLookaround=3