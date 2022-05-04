export function getPaginationProps(pageNum:number,limitNum:number, populate?:string[]|string){
    const options:any = {
        page: pageNum || 1,
        limit: limitNum || 10,
        populate: populate || null
      }
    return options
  }
