export function getYearFromDate(date:any){
    let formatedDate:any = new Date(date).toDateString()
     
    return formatedDate && formatedDate.split(' ')[3]
}

export function getDateSeparated(date:Date){
    const newDate = new Date(date).toString()
    const month = newDate.split(' ')[1]
    const day = newDate.split(' ')[0]
    const year = new Date(date).getFullYear();
    return {
      day,
      month,
      year
    }
  }