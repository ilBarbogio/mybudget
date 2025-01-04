import "./components/fileinput/fileInput.js"
import "./components/fileexplorer/fileExplorer.js"
import "./components/monthlist/monthList.js"
import "./components/yearcontainer/yearContainer.js"
import "./components/budgetentry/budgetEntry.js"
import "./components/iconbutton/iconButton.js"

import { MainToolbar } from "./components/toolbar/toolbar.js"

import { IconButton } from "./components/iconbutton/iconButton.js"

import { FileExplorer } from "./components/fileexplorer/fileExplorer.js"
import { FileInput } from "./components/fileinput/fileInput.js"

import { YearContainer } from "./components/yearcontainer/yearContainer.js"
import { MonthList } from "./components/monthlist/monthList.js"
import { BudgetEntry} from "./components/budgetentry/budgetEntry.js"
import { RecordInput } from "./components/recordinput/recordInput.js"


customElements.define("main-toolbar",MainToolbar)

customElements.define("icon-button",IconButton)

customElements.define("file-explorer",FileExplorer)
customElements.define("file-input",FileInput)

customElements.define("year-container",YearContainer)
customElements.define("month-list",MonthList)
customElements.define("budget-entry",BudgetEntry)
customElements.define("record-input",RecordInput)