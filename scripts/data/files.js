export const readDiskData=async (url,options=undefined)=>{
  console.log("fetching")
  const textData=await fetch(url).then(res=>res.text())
  // console.log(textData)

  if(options?.legacyFile) return parseLegacyData(textData)
}
export const parseLegacyData=(dataString)=>{
  let data=dataString.split("\n")
  let keys=data[2].replace("cash","value").split(",")
  let user=data[1].split(",")[0]
  let year=data[1].split(",")[1]
  let records=[]
  for(let i=3;i<data.length;i++){
    let values=data[i].split(",")
    if(values!=undefined && values.length>1){
      let record={}
      for(let [j,k] of keys.entries()){
        record[k]=values[j]
      }
      record.id=Number.parseInt(record.id)
      records.push(record)
    }
  }
  return {user,year,data:{records}}
}