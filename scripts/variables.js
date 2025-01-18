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
// export const ADD_ENTRY_REQUEST_EVENT="toggle-entry-input-add"
export const ADD_ENTRY_EVENT="add-entry"
// export const ADD_ENTRY_CONFIRM_EVENT="add-entry-confirm"

// export const DELETE_ENTRY_REQUEST_EVENT="request-delete-entry"
export const DELETE_ENTRY_EVENT="delete-entry"
// export const DELETE_ENTRY_CONFIRM_EVENT="delete-entry-confirm"

// export const UPDATE_ENTRY_REQUEST_EVENT="toggle-entry-input-update"
export const UPDATE_ENTRY_EVENT="update-entry"
// export const UPDATE_ENTRY_CONFIRM_EVENT="update-entry-confirm"

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
  {id:11, icon:"salute", label:"cura persona"},
  {id:12, icon:"cibo", label:"cibo fuori"},
]

export const pages={
  calendar:"calendar",
  filemanager:"filemanager",
  reportspage:"reportspage",
  categorymanager:"categorymanager",
}


export const seasonColors=[
  {backgroundImage:"./assets/pattern_hemp.svg",background:"#2a4b4daa",month:"#4bbec2aa",monthBorder:"#9effdd4d"},
  {backgroundImage:"./assets/pattern_hemp.svg",background:"#2a4b4daa",month:"#4bbec2aa",monthBorder:"#9effdd4d"},
  {backgroundImage:"./assets/pattern_hemp.svg",background:"#2a4b4daa",month:"#4bbec2aa",monthBorder:"#9effdd4d"},

  {backgroundImage:"./assets/pattern_flowers.svg",background:"#1cb941aa",month:"#4bc262aa",monthBorder:"#a0ff9e4d"},
  {backgroundImage:"./assets/pattern_flowers.svg",background:"#1cb941aa",month:"#4bc262aa",monthBorder:"#a0ff9e4d"},
  {backgroundImage:"./assets/pattern_flowers.svg",background:"#1cb941aa",month:"#4bc262aa",monthBorder:"#a0ff9e4d"},

  {backgroundImage:"./assets/pattern_hemp.svg",background:"#ffa062aa",month:"#fffa62aa",monthBorder:"#fffa62aa"},
  {backgroundImage:"./assets/pattern_hemp.svg",background:"#ffa062aa",month:"#fffa62aa",monthBorder:"#fffa62aa"},
  {backgroundImage:"./assets/pattern_hemp.svg",background:"#ffa062aa",month:"#fffa62aa",monthBorder:"#fffa62aa"},

  {backgroundImage:"./assets/pattern_arrow.svg",background:"#764a10aa",month:"#c28e4baa",monthBorder:"#ffde9e4d"},
  {backgroundImage:"./assets/pattern_arrow.svg",background:"#764a10aa",month:"#c28e4baa",monthBorder:"#ffde9e4d"},
  {backgroundImage:"./assets/pattern_arrow.svg",background:"#764a10aa",month:"#c28e4baa",monthBorder:"#ffde9e4d"},
]