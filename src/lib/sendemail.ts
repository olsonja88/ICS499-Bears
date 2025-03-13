import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail(to: string, subject: string, body: string) {
    try {
        const response = await resend.emails.send({
            from: "dancepedia-pw-reset@resend.dev", // Can add our own custom domain later
            to,
            subject,
            html: `<p>${body}</p>`,
        });

        console.log("Email sent:", response);
        return response;
    } catch (error) {
        console.error("Resend Email Error:", error);
        throw new Error("Email sending failed");
    }
}
