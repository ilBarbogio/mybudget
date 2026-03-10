export const getMonthLength=(month,year)=>{
  switch(month){
    case 3:
    case 5:
    case 6:
    case 10:
      return 30
    case 1:
      let date=new Date()
      date.setFullYear(year)
      date.setMonth(month)
      date.setDate(29)
      if(date.getMonth()==month) return 29
      else return 28
    default: return 31
  }
}

export const sanitizeNumber=(value)=>{
  return Math.floor(value*100)/100
}
export const formatNumber=(value)=>{
  const v=sanitizeNumber(value).toString()
  if(v.includes(".")){
    const splitted=v.split(".")
    return `${splitted[0]}.${splitted[1].slice(0,2).padEnd(2,"0")}`
  }else return `${v}.00`
}

export const dayDateFormat=(date)=>{
  // let split=date.split("-")
  let d=new Date(date)
  return {day:d.toLocaleDateString("it",{weekday:"short"}), month:d.toLocaleDateString("it",{month:"short"}), date:d.getDate()}
}

export const dateToYYYYMMDD=(date=new Date())=>{
  return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,"0")}-${date.getDate().toString().padStart(2,"0")}`
}