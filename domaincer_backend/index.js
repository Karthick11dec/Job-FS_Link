const express = require('express');
const mongodb = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = mongodb.MongoClient;
const dbUrl = process.env.DBURL || 'mongodb://127.0.0.1:27017';
// const dbUrl = 'mongodb://127.0.0.1:27017';
const PORT = process.env.PORT || 5000;
const database = 'Domaincer';
const userCollection = 'domaincer';

const { authenticate, createJWT } = require('./auth');

//demo api's

app.get('/', (req, res) => {
    res.send("this is from working condition");
});

// common api's

app.post('/register', async (req, res) => {
    try {
        let client = await mongoClient.connect(dbUrl);
        let opendb = client.db(database);
        let already = await opendb.collection(userCollection).findOne({ Email: req.body.Email });
        if (!already) {
            let salt = await bcryptjs.genSalt(10);
            let hash = await bcryptjs.hash(req.body.Password, salt);
            let data = await opendb.collection(userCollection)
                .insertOne({
                    Type: req.body.Type,
                    Firstname: req.body.Firstname,
                    Lastname: req.body.Lastname,
                    Email: req.body.Email,
                    Password: hash,
                    Mobile: req.body.Mobile,
                });
            res.json({ message: "Registered Succesfully.", data });
        } else {
            res.status(200).json({ message: "The Email already have the account...please login to continue!", already });
        }
        client.close();
    } catch (error) {
        res.status(500).json({ message: "Internal server Error!", error });
    }
});

app.post('/login', async (req, res) => {
    try {
        let client = await mongoClient.connect(dbUrl);
        let db = client.db(database);
        let user = await db.collection(userCollection).findOne({ Email: req.body.Email });
        if (user) {
            let result = await bcryptjs.compare(req.body.Password, user.Password);
            if (result) {
                const token = await createJWT({ user });
                // console.log(token,user.Type)
                res.json({ message: "Login Successfully...Allow them.", token, type: user.Type });
            } else {
                res.json({ message: 'Password invalid!' });
            }
        } else {
            res.status(200).json({ message: 'User not found!' });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server Error!", error });
    }
});

app.post('/email', async (req, res) => {
    try {
        let client = await mongoClient.connect(dbUrl);
        let db = client.db(database);
        let user = await db.collection(userCollection).findOne({ Email: req.body.Email });
        if (user) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD,
                },
            });
            let mailOptions = {
                from: process.env.EMAIL,
                to: user.Email,
                subject: 'Reset Password',
                text: 'click here to reset password',
                html:
                    '<h3>Reset your password Here</h3><a href="https://domaincer.netlify.app/reset">Click Here</a>'
            };
            transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json({ message: "mail sent to your targetmail..check it.", data })
                }
            });
        } else {
            res.status(200).json({ message: "email invalid!" });
        }
        client.close();
    } catch (error) {
        res.status(500).json({ message: "Internal server Error!", error });
    }
});

app.put('/reset', async (req, res) => {
    try {
        let client = await mongoClient.connect(dbUrl);
        let db = client.db(database);
        let data = await db.collection(userCollection).findOne({ Email: req.body.Email });
        if (data) {
            let result = await bcryptjs.compare(req.body.Password, data.Password);
            if (!result) {
                let salt = await bcryptjs.genSalt(10);
                let hash = await bcryptjs.hash(req.body.Password, salt);
                let set = await db.collection(userCollection)
                    .findOneAndUpdate({ Email: req.body.Email }, { $set: { Password: hash } });
                res.json({ message: "new password update successfully.", set });
            } else {
                res.json({ message: "entered password is same as existing one!" });
            }
        } else {
            res.status(200).json({ message: "user not found!" });
        }
        client.close();
    } catch (error) {
        res.status(500).json({ message: "Internal server Error!", error });
    }
});

//shared api's

app.post('/submit/:id', [authenticate], async (req, res) => {
    try {
        let client = await mongoClient.connect(dbUrl);
        let db = client.db(database);
        let id = mongodb.ObjectID(req.params.id);
        let data = await db.collection(userCollection).findOne({ _id: id });
        // let data1 = {...data}
        // console.log(data1)
        // let assign = Object.assign([],data1)
        // console.log(assign);
        if (data) {
            let check2 = await db.collection(userCollection).find({ submit: "submission" }).toArray();
            let verify = check2.some(check => {
                let danger = JSON.stringify(data._id).split("");
                let original = danger.splice(1, danger.length - 2).join("");
                // console.log(original)
                return ((check.mail === req.body.mail) && (original === check.id))
            })
            // console.log(verify)
            if (!verify) {
                let task = await db.collection(userCollection).insertMany(
                    [
                        {
                            submit: "submission",//for verify and insert
                            mail: req.body.mail,
                            id: req.params.id,
                            Name: req.body.name,
                            Resume: req.body.resume,
                            Git: req.body.git,
                            Portifolio: req.body.portifolio
                        },
                        {
                            Recruiter: "Applicants",//for recruiter
                            Title: data.Title,
                            Name: req.body.name,
                            Resume: req.body.resume,
                            Git: req.body.git,
                            Portifolio: req.body.portifolio,
                            Data: [{ ...data, newdate: req.body.date, newtime: req.body.time }]
                        },
                        {
                            Candidate: req.body.mail,//for candidate
                            Data: [{ ...data, newdate: req.body.date, newtime: req.body.time }]
                        }
                    ]
                )
                res.status(200).json({ message: "Applied Succedfully.", task });
                client.close();
            }
            else {
                console.log("true")
                res.status(500).json({ message: "Already you were Applied!" })
            }
        } else {
            res.status(500).json({ message: "Id not found!" });
        }
    }
    catch (error) {
        res.status(404).json({ message: "Internal server Error!", error });
        console.log(error)
    }
})

// recruiter api's

app.post('/posting', [authenticate], async (req, res) => {
    try {
        let client = await mongoClient.connect(dbUrl);
        let db = client.db(database);
        let data = await db.collection(userCollection).insertOne({
            Poster: req.body.mail,
            Name: req.body.Name,
            Getter: "newjobs",
            Website: req.body.website,
            Title: req.body.title,
            About: req.body.about,
            Des: req.body.description,
            Role: req.body.roles,
            Ctc: req.body.ctc,
            Dates: req.body.date,
            Time: req.body.time
        });
        res.status(200).json({ message: "Job posted Succedfully.", data });
        client.close();
    }
    catch (error) {
        res.status(500).json({ message: "Internal server Error!", error });
    }
})

app.post('/posted', [authenticate], async (req, res) => {
    try {
        let client = await mongoClient.connect(dbUrl);
        let db = client.db(database);
        let data = await db.collection(userCollection).find({ Poster: req.body.mail }).toArray();
        if (data) {
            res.status(200).json({ message: "Jobs fetched Succedfully.", data });
            client.close();
        }
        else {
            res.status(404).json({ massage: "Query not found!" })
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server Error!", error });
    }
})

app.post("/profile", [authenticate], async (req, res) => {
    try {
        let client = await mongoClient.connect(dbUrl);
        let db = client.db(database);
        let data = await db.collection(userCollection).findOne({ Email: req.body.mail });
        if (data) {
            res.status(200).json({ message: "Data found", data })
            client.close();
        }
        else {
            res.status(404).json({ massage: "Query not found!" })
        }
    } catch (error) {
        res.status(500).json({ error })
    }
})

app.post("/recruiter", [authenticate], async (req, res) => {
    try {
        let client = await mongoClient.connect(dbUrl);
        let db = client.db(database);
        let data = await db.collection(userCollection).find({ Recruiter: "Applicants" }).toArray();
        if (data) {
            res.status(200).json({ message: "Jobs fetched Succedfully.", data });
            client.close();
        }
        else {
            res.status(500).json({ message: "Data not found!" });
        }
        client.close();
    } catch (error) {
        res.status(404).json({ message: "Internal server Error!", error });
    }
})

//candidate api's

app.post('/getter', [authenticate], async (req, res) => {
    try {
        let client = await mongoClient.connect(dbUrl);
        let db = client.db(database);
        let data = await (await db.collection(userCollection).find({ Getter: "newjobs" }).toArray());
        if (data) {
            res.status(200).json({ message: "Jobs fetched Succedfully.", data });
            client.close();
        }
        else {
            res.status(404).json({ massage: "Query not found!" })
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server Error!", error });
    }
})

app.post('/getter/:id', [authenticate], async (req, res) => {
    try {
        let client = await mongoClient.connect(dbUrl);
        let db = client.db(database);
        let id = mongodb.ObjectID(req.params.id);
        let data = await db.collection(userCollection).findOne({ _id: id });
        if (data) {
            res.status(200).json({ message: "Jobs fetched Succedfully.", data });
            client.close();
        }
        else {
            res.status(404).json({ massage: "Query not found!" })
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server Error!", error });
    }
})

app.post("/candidate", [authenticate], async (req, res) => {
    try {
        let client = await mongoClient.connect(dbUrl);
        let db = client.db(database);
        let data = await db.collection(userCollection).find({ Candidate: req.body.mail }).toArray();
        if (data) {
            res.status(200).json({ message: "Jobs fetched Succedfully.", data });
            client.close();
        }
        else {
            res.status(500).json({ message: "Data not found!" });
        }
        client.close();
    } catch (error) {
        res.status(404).json({ message: "Internal server Error!", error });
    }
})

app.listen(PORT, () => { console.log(`The Awesome Domaincer task running Successfully @ ::: ${PORT}`) })