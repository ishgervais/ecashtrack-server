import { TResponse } from "./types";

// function to format the response body
export function formatResponse (success:boolean,message:string,data:any){
  return {
    success,
    message,
    data
  };
};

