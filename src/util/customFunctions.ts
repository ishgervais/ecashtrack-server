export function getYearFromDate(date:any){
    let formatedDate:any = new Date(date).toDateString()
     
    return formatedDate && formatedDate.split(' ')[3]
}