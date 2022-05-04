import mongoose from 'mongoose';
import { EStatus } from '../util/types/enums';
const pagination = require('mongoose-paginate-v2')
const HistoryLogsSchema = new mongoose.Schema({
    activity:{
        type:String,
        required:true
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


HistoryLogsSchema.plugin(pagination)

const HistoryLog: any = mongoose.model("HistoryLog", HistoryLogsSchema)
export {HistoryLog}