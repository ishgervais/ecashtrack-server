import mongoose from 'mongoose';
import { ERole, EStatus } from '../util/types/enums';
const pagination = require('mongoose-paginate-v2')
const UserSchema = new mongoose.Schema({
    first_name:{
        type:String,
        minLength:[3,'The firstname should be atleast 3 characters'],
        required:true
    },
    last_name:{
        type:String,
        minLength:[3,'The lastname should be atleast 3 characters']
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    phone_number:{
        type: String,
        maxLength:[12,'The phone number should not be beyond 12 digits'],
        minLength:[12,'The phone number should be at least 12 digits'],
        // unique:true,
        
    },
    password:{
        type:String,
        minLength:[5,'The password should be atleast 5 characters'],
        
    },
    role:{
        type:String,
        enum:[ERole.ADMIN,ERole.USER1, ERole.USER2]
    },
    file_link:{
        type:String,
    },
    status:{
        type:String,
        default: EStatus.ACTIVE,
        enum:[EStatus.ACTIVE, EStatus.INACTIVE]
    }

},{
    timestamps:true,
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    }
})


UserSchema.plugin(pagination)

const User: any = mongoose.model("User", UserSchema)
export {User}