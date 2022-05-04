import nodemailer from 'nodemailer';
import { Request, Response } from 'express'
import dotenv from 'dotenv';

dotenv.config()

export async function sendMail(req:Request, res: Response){
    try{
        let sender = {
            email:process.env.NODEMAILER_ACCOUNT_EMAIL,
            pass: process.env.NODEMAILER_ACCOUNT_PASSWORD
  
        }
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: sender.email, 
        pass: sender.pass, 
      },
    });
    let info = await transporter.sendMail({
      from: '"x-Pense" <gervism11@gmail.com>', 
      to: req.body.email,
      subject: "x-Pense | Booking Confirmation Email ✔",
      html: '<div style="width:100%; display:flex; justify-content:center;"><div style="width:70%;height:100%;padding:5%;background-color:#fff;position: relative;"><div><img src="https://res.cloudinary.com/ddhssri3t/image/upload/v1637609603/Kigali-Green-Gallery-store/icons/black_logo_anpb4w.png" style="width:10%; height: 10%; margin-bottom: 2%" alt=""/></div><div style="width:90%;height:80%;display:flex;justify-content:center;align-items:center;"><div style=" width:70%; height:100%;border-radius:5px; background-color:#000; color:#fff; display: flex; align-items: center; font-size:15px; font-family:\'Trebuchet MS\', \'Lucida Sans Unicode\', \'Lucida Grande\', \'Lucida Sans\', Arial, sans-serif; letter-spacing: 1px ; line-height: 30px; padding:5%; "><div style="width:100%"><div>Dear '+req.body.names+',</br>Your booking at x-Pense’s website was made successfully. We hope you enjoy your moment there.</div><div style=" margin:10px 0px; color:gray;font-size:13px;"><p>Sparkle<br/>CEO&Co-Founder at Sparkle</p></div></div></div></div><div style="display: flex; justify-content: end;position: relative; width: 100%"><div><img src="https://res.cloudinary.com/ddhssri3t/image/upload/v1637609617/Kigali-Green-Gallery-store/icons/logo_abstract_primary_telyaf.svg" alt="" style="width:40%; margin-top:5% "/></div></div></div>', 
    });

    return res.send({success:true, message:"Booking confirmation is sent on your email", data:info})
    }catch (e) {
        return res.send({success:false, message:e})
    }

}