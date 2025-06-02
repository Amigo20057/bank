import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

const config = new ConfigService();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.getOrThrow<string>("EMAIL_USER"),
        pass: config.getOrThrow<string>("EMAIL_PASS"),
    },
});

export const sendVerificationEmail = async (email: string, code: string) => {
    const mailOptions = {
        from: config.getOrThrow<string>("EMAIL_USER"),
        to: email,
        subject: "Your verification code",
        text: `Your verification code is: ${code}`,
    };

    await transporter.sendMail(mailOptions);
};
