import React, { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import "./common.css";
import MainNav from "./Navbar";

function Login() {

    //login
    const [sign, setsign] = useState(true);
    const [login, setlogin] = useState("Login");
    const [mail, setmail] = useState("");
    const [passcode, setpasscode] = useState("");
    //intermediate
    const [change, setchange] = useState(false);
    //forgot
    const [reset, setreset] = useState("");
    const [send, setsend] = useState("Send");

    const history = useHistory();

    //effect for login

    useEffect(() => {
        if (mail.length > 0 && mail.includes("@") && passcode.length >= 8) {
            setsign(false);
        } else {
            setsign(true);
        }
    }, [mail, passcode])

    //effect for forgot

    useEffect(() => {
        if (reset.length > 0 && reset.includes("@")) {
            setsign(false);
        } else {
            setsign(true);
        }
    }, [reset])

    //Erase for login
    const Erase = () => {
        setmail("");
        setpasscode("");
    }

    //function for login
    const Login = (e) => {

        e.preventDefault();

        if (mail.length > 0 && mail.includes("@") && passcode.length >= 8) {

            fetch("https://domaincer-backend.herokuapp.com/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Email: mail,
                    Password: passcode,
                })
            }).then(res => { return res.json() })
                .then((res) => {
                    // console.log(res)
                    if (res.token) {
                        localStorage.setItem('token', res.token)
                        Erase();
                        setlogin("Success");
                        setTimeout(() => {
                            alert("Login successfully.")
                            if (res.type === "poster") {
                                history.replace('/recruiter');
                            }
                            else {
                                history.replace('/candidate');
                            }
                        }, 1000);
                    }
                    else if (res.message === 'Password invalid!') {
                        alert("Invalid password!");
                    }
                    else if (res.message === 'User not found!') {
                        alert("You are not having an account (or) invalid email!");
                    }
                    else if (res.error) {
                        alert(res.message);
                    }
                });
        } else {
            alert("Fields should not be empty!");
        }
    }

    //Erase for reset
    const Eraser = () => {
        setreset("");
    }

    //function for reset
    const Reset = (e) => {

        e.preventDefault();

        if (reset.length > 0 && reset.includes("@")) {
            fetch("https://domaincer-backend.herokuapp.com/email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Email: reset,
                })
            }).then(res => { return res.json() })
                .then((res) => {
                    // console.log(res)
                    if (res.data) {
                        Eraser();
                        setsend("Success");
                        setTimeout(() => {
                            alert(res.message);
                            history.push('/login');
                        }, 1000);
                    }
                    else if (res.message === "email invalid!") {
                        alert("Invalid email!");
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
            {!change ? (
                <div className="form main square">
                    <h3 className="pb-3">Login with yours</h3>
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
                        <lable className="bold">Password: (<small>Your current Password</small>)</lable>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="should more than 8 chars"
                            value={passcode}
                            onChange={(e) => { setpasscode(e.target.value) }}
                        />
                    </div>
                    <button type="button" className="btn btn-danger m-3 " disabled={sign} onClick={(e) => { Login(e) }}>{login}</button>
                    <p className="d-flex justify-content-center line" onClick={() => { setchange(!change) }}>
                        {change ? (<b>Back to login!</b>) : <b>Forgot Password? Reset!</b>}
                    </p>
                </div>
            ) : (
                <div className="form main square">
                    <h3 className="pb-3">Reset Link</h3>
                    <div className="form-group">
                        <lable className="bold">Email: (<small>Your account email</small>)</lable>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="ex:karthick@gmail.com"
                            value={reset}
                            onChange={(e) => { setreset(e.target.value) }}
                        />
                    </div>
                    <button type="button" className="btn btn-danger m-3" disabled={sign} onClick={(e) => { Reset(e) }}>{send}</button>
                    <p className="d-flex justify-content-center line" onClick={() => { setchange(!change) }}>
                        {change ? (<b>Back to login!</b>) : <b>Forgot Password? Reset!</b>}
                    </p>
                </div>
            )}
        </Fragment>
    )
}

export default Login
