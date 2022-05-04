import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'
import { Request, Response } from 'express'

dotenv.config()
export function sendMail(req: Request, res: Response){
    const q = req.query.action
    const API_KEY:any = process.env.SENDGRID_API_KEY
    sgMail.setApiKey(API_KEY)
    let message
    if(q==='booking'){
        message = {
            to: req.body.email,
            from:{
                name:"Kigali Green Gallery",
                email:"gersh250@gmail.com"
            },
            subject:"x-Pense | Booking Confirmation Email",
            html: ' <div style="width:90%;height:700px;padding:5%;background-color:#fff,"> <div> <img src="https://res.cloudinary.com/ddhssri3t/image/upload/v1637609603/Kigali-Green-Gallery-store/icons/black_logo_anpb4w.png" style="width:70px; "border:1px solid black; alt=""/> </div><div style="width:90%;height:500px;display:flex;justify-content:center;align-items:center;" > <div style=" width:70%; height:170px; background-color:#000; color:gray; display: flex; align-items: center; font-size:18px; font-family: \'Franklin Gothic Medium\', \'Arial Narrow\', Arial, sans-serif; padding:10%; " > <div style="width:80%"> <p> Your booking via Kigali Green Gallery’s website was made successfully. We hope you enjoy your moment there. </p><div style=" margin:10px 0px; color:#fff; font-weight:bold " > <p> Ghislain Irakoze <br/> CEO & Co-Founder at Wastezon </p></div></div></div></div><div style=" width:90%; height:300px; display: flex; justify-content: end; " > <div> <img src="https://res.cloudinary.com/ddhssri3t/image/upload/v1637609617/Kigali-Green-Gallery-store/icons/logo_abstract_primary_telyaf.svg" alt="" style="width:70px; "/> </div></div>'
        }
    }
    // other actions like resetting password
    else{
        message = {
            to: req.body.email,
            from:{
                name:"x-Pense Director",
                email:"gersh250@gmail.com"
            },
            subject:"Booking Confirmation Email",
            html: "<h1>Thank you for your booking. This is to let you know that we have received your information.</>"
        }
    }

    
    sgMail.send(message)
    .then(response => {
        return res.send({success:true, message:"Booking confirmation is sent on your email", data:response})
    })
    .catch((e:any)=>{
        return res.send({success:false, message:e})
    })

}   