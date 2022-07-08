import { ECurrency, EDebtStatus, EPaymentStatus, EStatus } from "./enums";

export type TResponse = {
    success:boolean,
    data?:any
    message?:string
}

// models


export type TUser = {
    id:string
    first_name:string,
    last_name:string,
    email:string,
    phone_number:string
    password:string,
    role:string,
    status:EStatus
}

export type TUserPassword = {
    user?:TUser
    user_id:any
    oldPassword:string
    newPassword:string
}

export type TBudget  = {
    id:string
    name:string
    initiated_amount:number
    consumed_amount:number
    description:string
    start_date:string
    end_date:string
    status:EStatus
    currency:ECurrency
}

export type TExpenseCategory = {
    name:string
    description:string
    created_by:TUser
}
export type TExpense = {
    name:string
    amount:number
    currency:ECurrency
    category:TExpenseCategory
    budget:TBudget
    created_by:TUser
    status:EStatus

}


export type TDebt = {
    name:string
    payment:Number
    estimated_payment:Number
    currency:ECurrency
    holder_status:EDebtStatus
    month:String
    year:number
    created_by:TUser
    status:EStatus

    // req body types
    issued_date:Date

}

export type TBookingDate = {
    date: string
    count: Number
    created_by:TUser
    status: EStatus
}

export type TBooking = {
    client_names:string
    booking_date:TBookingDate
    payment:Number
    estimated_payment:Number
    month:string
    year:number
    created_by:TUser
    status:EStatus,
    payment_status:EPaymentStatus

}
export type THistoryLog = {
    activity:string
    created_by:TUser
    status?:EStatus
}