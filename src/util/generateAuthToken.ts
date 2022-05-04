const jwt = require('jsonwebtoken')
let secretKey:any = process.env.JWT_SECRET
export function generateToken(id:any, role:string){
    return jwt.sign(
        {
           id,
           role
        },
        secretKey,
        {
            expiresIn:process.env.JWT_EXPIRE,
        } 
    )
} 