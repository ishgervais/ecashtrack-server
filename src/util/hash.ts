const bcrypt = require('bcrypt');
     export async function hashPassword(password:string){
        const genSalt = await bcrypt.genSalt(15);
        const hashed = await bcrypt.hash(password,genSalt)
        return hashed
     }

     export async function comparePassword(inputPassword:string, password:string){
         return await bcrypt.compare(inputPassword,password)
     }

