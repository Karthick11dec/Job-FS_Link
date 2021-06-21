import React, { Fragment, useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom";
import "./common.css";
import MainNav from "./Navbar";


function Register() {

    const [sign, setsign] = useState(true);
    const [register, setregister] = useState("Register");
    const [fName, setfName] = useState("");
    const [lName, setlName] = useState("");
    const [mail, setmail] = useState("");
    const [passcode, setpasscode] = useState("");
    const [mobile, setmobile] = useState("");

    const history = useHistory();
    const { param } = useParams();

    useEffect(() => {
        if (fName.length > 0 && lName.length > 0
            && mail.length > 0 && mail.includes("@")
            && passcode.length >= 8 && mobile.length === 10) {
            setsign(false);
        }
        else {
            setsign(true);
        }
    }, [fName, lName, mail, passcode, mobile])

    const Erase = () => {
        setfName("");
        setlName("");
        setmobile("");
        setpasscode("");
        setmobile("");
    }

    const Sign = (e) => {

        e.preventDefault();

        if (fName.length > 0 && lName.length > 0 &&
            mail.length > 0 && mail.includes("@") &&
            passcode.length >= 8 && mobile.length === 10) {

            fetch("https://domaincer-backend.herokuapp.com/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Type: param,
                    Firstname: fName,
                    Lastname: lName,
                    Email: mail,
                    Password: passcode,
                    Mobile: mobile,
                })
            }).then(res => { return res.json() })
                .then((res) => {
                    // console.log(res)
                    if (res.already) {
                        alert(res.message);
                    }
                    else if (res.data) {
                        Erase();
                        setregister("Success");
                        setTimeout(() => {
                            alert("Your profile has been register successfully.");
                            history.push('/login');
                        }, 1000);
                    }
                    else {
                        alert("something went wrong with register!");
                    }
                });
        }
        else {
            alert("All of the Above field should be filled with proper Data!");
        }
    }

    return (
        <Fragment>
            <MainNav />
            <div className="form main square mb-5">
                <h3 className="pb-3">Register Your Profile</h3>
                <div className="form-group">
                    <lable className="bold">Firstname:</lable>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="ex:Karthick"
                        value={fName}
                        onChange={(e) => { setfName(e.target.value) }}
                    />
                </div>
                <div className="form-group">
                    <lable className="bold">Lastname:</lable>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="ex:Raja"
                        value={lName}
                        onChange={(e) => { setlName(e.target.value) }}
                    />
                </div>
                <div className="form-group">
                    <lable className="bold">Email: (<small>Active email</small>)</lable>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="ex:karthick@gmail.com"
                        value={mail}
                        onChange={(e) => { setmail(e.target.value) }}
                    />
                </div>
                <div className="form-group">
                    <lable className="bold">Password: (<small>Create new password for this site</small>)</lable>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="should more than 8 chars"
                        value={passcode}
                        onChange={(e) => { setpasscode(e.target.value) }}
                    />
                </div>
                <div className="form-group">
                    <lable className="bold">Mobile:</lable>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="10 digit mobile number"
                        maxLength="10"
                        value={mobile}
                        onChange={(e) => { setmobile(e.target.value) }}
                    />
                </div>
                <button type="button" className="btn btn-danger m-3" disabled={sign} onClick={(e) => { Sign(e) }}>{register}</button>
                <p className="d-flex justify-content-center">Already have an account? here<a href="/login"><b className="ml-1">login</b></a></p>
            </div>
        </Fragment>
    )
}

export default Register
