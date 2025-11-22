import dotenv from 'dotenv'
import { transporter } from '../config/transporter.js'
dotenv.config()
let OTP =0;
export const sendOTPEmail=(recipent_email)=>{
    OTP= Math.floor(Math.random()*899999+100000);
    
    return new Promise((resolve, reject)=>{
        const mail_config= {
            from: process.env.SMTP_USER,
            to:recipent_email,
            subject: "MANHFOODIE PASSWORD RECOVERY",
            html: `
            <!DOCTYPE html>
            <html lang="en" >
            <head>
                <meta charset="UTF-8">
                <title> Manh - OTP Email Template</title>
            </head>
            <body>
                <div style="font-family: Helvetica, Arial, san-serif;min-width:1000px;overflow:auto;line-height:2">
                    <div style="margin:50px auto;width:70%;padding:20px 0">
                        <div style="border-bottom:1px solid #eee">
                            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">ManhFoodie</a>
                        </div>
                        <p style="font-size:1.1em">Hi,</p>
                        <p>Thank you for choosing ManhFoodie. Use the following OTP to complete your password recovery process, OTP is valid for 5 minutes</p>
                        <h2 style="background:#00466a;margin: 0 auto;width: max-content; padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
                        <p style="font-size:0.9rem;">Regards,<br/> ManhFoodie</p>
                        <hr style="border:none;border-top:1px solid #eee"/>
                        <div style="float:right; padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                            <p>ManhFoodie Inc</p>
                            <p>Hai phong</p>
                            <p>Viet nam</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            `
        };
        
        transporter.sendMail(mail_config,(err,info)=>{
            if(err){
                console.log(err)
                return reject({message: `An error has occured`});
            }
            if(checkEmail(recipent_email)===false) return reject({message: "register your email first"})
            return resolve({message: "Email send successfully"});
        });
        console.log(OTP);

    });
}
export const verifyOTP= async (inputOTP, accessToken)=>{
    
    try{
        if(!inputOTP)return{
            message: "type in your OTP first",
            status: 400,
        }
        if(OTP<100000 ) return{
            message: "OTP is still not generate",
            status: 500,
        }
        if(OTP != inputOTP)return{
            message: "OTP is incorrect",
            status: 400,
        }
        return{
            message: "successful",
            accessToken: accessToken,
            status: 200
        }
    }catch(e){
        return{
            message: "server error",
            status: 500
        }
    }
}
export const resetOTP=()=>{
    OTP= 36; 
}
const checkEmail = async(email)=>{
    try{
    const [user]= await sequelizeInstance
        .query("SELECT email FROM users WHERE email= ?",{
            replacements: [email],
            type: sequelizeInstance.QueryTypes.SELECT
        })
    if(user){
        return true;
    }
        return false;
    }
    catch{
        return true;
    }
    
}
export const sendUserEmail=(name, userEmail, emailContent)=>{
    
    return new Promise((resolve, reject)=>{
        const mail_config= {
            from: userEmail,
            to: process.env.SMTP_USER,
            subject: `An email send by ${userEmail} from ManhFoodie`,
            html: `
            <!DOCTYPE html>
            <html lang="en" >
            <head>
                <meta charset="UTF-8">
                <title> email from ${name} </title>
            </head>
            <body>
                <div style="font-family: Helvetica, Arial, san-serif;min-width:1000px;overflow:auto;line-height:2">
                    ${emailContent}
                </div>
            </body>
            </html>
            `
        };
        
        transporter.sendMail(mail_config,(err,info)=>{
            if(err){
                console.log(err)
                return reject({message: `An error has occured`});
            }
            if(checkEmail(userEmail)===false) return reject({message: "register your email first"})
            return resolve({message: "Email send successfully"});
        });
        console.log(OTP);

    });
}