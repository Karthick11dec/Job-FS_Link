import React, { Fragment, useEffect, useState } from 'react';
import "./common.css";
import MainNav from "./Navbar";

function Reset() {

    const [mail, setmail] = useState("");
    const [passcode, setpasscode] = useState("");
    const [sign, setsign] = useState(true);
    const [reset, setreset] = useState("Reset");

    useEffect(() => {
        if (mail.length > 0 && mail.includes("@") && passcode.length >= 8) {
            setsign(false);
        } else {
            setsign(true);
        }
    }, [mail, passcode])

    const Erase = () => {
        setmail("");
        setpasscode("");
    }

    const Reset = (e) => {

        e.preventDefault();

        if (mail.length > 0 && mail.includes("@") && passcode.length >= 8) {

            fetch("https://domaincer-backend.herokuapp.com/reset", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Email: mail,
                    Password: passcode,
                })
            }).then((res) => { return res.json() })
                .then((res) => {
                    // console.log(res)
                    if (res.set) {
                        Erase();
                        setreset("Success");
                        alert("passcode reset successfully.");
                    }
                    else if (res.message === "entered password is same as existing one!") {
                        alert(res.message);
                    }
                    else if (res.message === "user not found!") {
                        alert("user not found (or) invalid email");
                    }
                    else if (res.error) {
                        alert(res.message);
                    }
                });
        } else {
            alert("Fields should not be empty!");
        }
    }


    return (
        <Fragment>
            <MainNav />
            <div className="form main square">
                <h3 className="pb-3">Reset Password</h3>
                <div className="form-group">
                    <lable className="bold">Email: (<small>Your account email</small>)</lable>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="ex:karthick@gmail.com"
                        value={mail}
                        onChange={(e) => { setmail(e.target.value) }}
                    />
                </div>
                <div className="form-group">
                    <lable className="bold">Password: (<small>Create a new Password</small>)</lable>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="should more than 8 chars"
                        value={passcode}
                        onChange={(e) => { setpasscode(e.target.value) }}
                    />
                    <small></small>
                </div>
                <button type="button" className="btn btn-danger m-3 " disabled={sign} onClick={(e) => { Reset(e) }}>{reset}</button>
            </div>
        </Fragment>
    )
}

export default Reset
