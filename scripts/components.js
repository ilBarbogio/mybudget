import { MainToolbar } from "./components/toolbar/toolbar.js"

import { MyIcon } from "./components/myicon/myicon.js"

import { FileExplorer } from "./components/fileexplorer/fileExplorer.js"

import { YearContainer } from "./components/yearcontainer/yearContainer.js"
import { MonthList } from "./components/monthlist/monthList.js"
import { BudgetEntry} from "./components/budgetentry/budgetEntry.js"
import { RecordInput } from "./components/recordinput/recordInput.js"

import { ReportsPage } from "./components/reports/reports.js"
import { ReportsBoard } from "./components/reports/board/reportsboard.js"


customElements.define("main-toolbar",MainToolbar)

customElements.define("my-icon",MyIcon)

customElements.define("file-explorer",FileExplorer)

customElements.define("year-container",YearContainer)
customElements.define("month-list",MonthList)
customElements.define("budget-entry",BudgetEntry)
customElements.define("record-input",RecordInput)

customElements.define("reports-page",ReportsPage)
customElements.define("reports-board",ReportsBoard)