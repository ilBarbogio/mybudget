# Data and File Management

MyBudget uses OPFS (origin protected file system) to persist data on the client since version 01.00.00. Relations with data are piped through two entry points:
- file data manager (filedata.js)
- file system manager (opfsdata.js) 

Each of these should implement a precise set of methods whatever the system chosen, much like an interface. Strict hiearchy and decoupling for these two is of primary concern.

## File data (filedata.js)

This manages all operations on data meant to encode and decode it when saving or loading.

## File system (<type>data.js)

This manages all operations meant to save or load or otherwise modify data stored locally.

### Method exposed by opfsdata.js

### connectMain()
Sets up the chosen local storage (complexity or even necessity of this element varies with the system chosen, for OPFS this connect to the root directory)

### createRecordFile=async(user, year, options={filename})
Creates an emtpy record file. Options enable filename's composition override (filename defaults to *user__year.json*). Version will default at the current appìs version, records and goals will be set as emtpy array.

### readRecordFile(filename)
Read a file stored with the given filename

### writeRecordFile=async(filename, user, year, version, records, goals)
Write to the given file, setting user, year, records, and goals. Any value relating to missing parameters will be kept as is.

### removeRecordFile(filename)
Removes the file from the file system.

### renameRecordFile()
Renames the file.

