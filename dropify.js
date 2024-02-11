const dialog = require("dialog-node");
const hound = require("hound");
const mailer = require("nodemailer");
const fs = require("fs");

const path = '/path/to/directory/to/be/watched';
const user_data_path = '/path/to/dropify_config/default_receiver.json';

let filename = '';

let watcher = hound.watch(path);

const smtpTransport = mailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "user name",
        pass: "application password",
    },
});

watcher.on('create', function (file, stats) {

    let user_data = JSON.parse(fs.readFileSync(user_data_path, 'utf8'));
    filename = file;
    console.log(`new file ${file} has been created`);

    if (user_data.receiver) {
        let mailBody = buildEmailBody(user_data.receiver);
        triggerEmailWithAttchment(mailBody);
    } else {
        let mailBody = dialog.entry("Enter email address", "Email", 10000, callback);
    }
});

function buildEmailBody(email) {
    return {
        from: "mbhattacharjee99x@gmail.com",
        to: email,
        subject: "Attachments",
        html: "<h3>Please find the attached!</h3>",
        attachments: [
            {
                filenaame: "test.png",
                path: filename
            }
        ]
    }
}

function triggerEmailWithAttchment(mailBody) {
    smtpTransport.sendMail(mailBody, function (error, info) {
        if (error) {
            console.log(error);
        }
        console.log("Email with attachment delivered successfully")
    });
}

function callback(code, text, err) {
    triggerEmailWithAttchment(buildEmailBody(text));
}