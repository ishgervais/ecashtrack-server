import mongoose from 'mongoose';
import { EStatus } from '../util/types/enums';
const pagination = require('mongoose-paginate-v2')
const BookingDateSchema = new mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    // times, ex: 1x
    count:{
        type:Number,
        default:1
    },
    status:{
        type:String,
        default: EStatus.ACTIVE,
        enum:[EStatus.ACTIVE, EStatus.INACTIVE]
    },
    created_by:{
        type:mongoose.Types.ObjectId,
        ref:"User"
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


BookingDateSchema.plugin(pagination)

const BookingDate: any = mongoose.model("BookingDate", BookingDateSchema)
export {BookingDate}