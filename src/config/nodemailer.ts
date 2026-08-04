import * as nodemailer from "nodemailer";
import { EMAIL_FROM, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from "./env.js";

let transporter: nodemailer.Transporter| null= null;

function getTransporter(){
    if(transporter){
        return transporter;
    }

    transporter= nodemailer.createTransport({
        host:SMTP_HOST,
        port:SMTP_PORT,
        secure:false,
        auth:SMTP_USER && SMTP_PASS?{
            user:SMTP_USER,
            pass:SMTP_PASS
        }: undefined
    });
    return transporter;
}

export async function sendEmail(to:string,subject:string, html:string){
    const transporter= getTransporter();
    await transporter.sendMail({
        from:EMAIL_FROM,
        to,
        html,
        subject
    });

    console.log(`[nodemailer] Email send to ${to} with subject ${subject}`);
}

