let nodemailer = require('nodemailer')
let { user, pass } = require('../../config/keys')

let sendEmail = async function ({ emailTo, subject, code, content }) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: user,
            pass: pass
        }
    })

    let message = {
        from: `"Blogging" ${user}`,
        to: emailTo,
        subject: subject,
        // text: "",
        html: `
            <div>
                <h3>Use this below code to ${content}</h3>
                <p><strong>Code: </strong> ${code}</p>
            </div>
        `
    }
    await transporter.sendMail(message)
}

module.exports = sendEmail 