export const APP_VERSION="01.00.00"
export const MAIN_DATABASE_NAME="myb_db_main"
export const MAIN_DATABASE_RECORD_STORE_NAME="datasets"
export const DATABASE_NAME="myb_db"
export const DATABASE_RECORD_STORE_NAME="records"

//EVENTS
//toggle calls
export const TOGGLE_SIDEBAR_EVENT="toggle-main-sidebar"
export const TOGGLE_RECORD_INPUT_EVENT="toggle-entry-input"

//action calls: request, act, confirm
export const ADD_ENTRY_EVENT="add-entry"
export const DELETE_ENTRY_EVENT="delete-entry"
export const UPDATE_ENTRY_EVENT="update-entry"


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

//KEYs
//local storage
export const LS_KEY_CURRENT_FILE="currentFile"


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
]

export const pages={
  calendar:"calendar",
  filemanager:"filemanager",
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

export const pageColors={
  [pages.filemanager]:"salmon",
  [pages.reportspage]:"slateblue",
}