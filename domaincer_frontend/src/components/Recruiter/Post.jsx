import React, { Fragment, useEffect, useState } from 'react';
import "./recruiter.css";

function Post() {

    const [Company, setCompany] = useState("");
    const [web, setweb] = useState("");
    const [title, settitle] = useState("");
    const [about, setabout] = useState("");
    const [job, setjob] = useState("");
    const [role, setrole] = useState("");
    const [salary, setsalary] = useState("");
    const [post, setpost] = useState("Post a job");
    const [sign, setsign] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (web.length > 0 && title.length > 0 && about.length && job.length > 0 && role.length > 0 && salary.length > 0) {
            setsign(false);
        }
    }, [Company, web, title, about, job, role, salary, post])

    const fulldate = () => {
        let d = new Date();
        let year = d.toLocaleDateString().split("/").splice(2, 1);
        let month = d.toLocaleDateString().split("/").splice(0, 2).reverse();
        let full = month.concat(year).join("/");
        return full;
    }

    const Handler = () => {

        fetch("https://domaincer-backend.herokuapp.com/posting", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: token
            },
            body: JSON.stringify({
                Name: Company,
                website: web,
                title: title,
                about: about,
                description: job,
                roles: role,
                ctc: salary,
                date: fulldate(),
                time: new Date().toLocaleTimeString()
            })
        }).then(res => { return res.json() })
            .then((res) => {
                if (res.data) {
                    Erase();
                    setpost("Success");
                    setsign(true);
                    alert("Job Posted.");
                }
                else {
                    console.log(res.message);
                    alert(res.message);
                }
            })
    }

    function Erase() {
        setweb("");
        settitle("");
        setabout("");
        setjob("");
        setrole("");
        setsalary("");
    }


    return (
        <Fragment>
            <div className="form boxing content">
                <h3 className="pb-2">Post the Recuirment</h3>
                <div className="form-group">
                    <label><b>Company Name : </b></label>
                    <textarea
                        className="textarea form-control"
                        rows="1"
                        value={Company}
                        onChange={(e) => { setCompany(e.target.value) }}
                    />
                </div>
                <div className="form-group">
                    <label><b>Company Website : </b></label>
                    <textarea
                        className="textarea form-control"
                        rows="2"
                        value={web}
                        onChange={(e) => { setweb(e.target.value) }}
                    />
                </div>
                <div className="form-group">
                    <label><b>Job Title : </b></label>
                    <textarea
                        className="textarea form-control"
                        rows="2"
                        value={title}
                        onChange={(e) => { settitle(e.target.value) }}
                    />
                </div>
                <div className="form-group">
                    <label><b>About the company :</b></label>
                    <textarea
                        className="textarea form-control"
                        rows="5"
                        value={about}
                        onChange={(e) => { setabout(e.target.value) }}
                    />
                </div>
                <div className="form-group">
                    <label><b>Job Description :</b></label>
                    <textarea
                        className="textarea form-control"
                        rows="5"
                        value={job}
                        onChange={(e) => { setjob(e.target.value) }}
                    />
                </div>
                <div className="form-group">
                    <label><b>Roles :</b></label>
                    <textarea
                        className="textarea form-control"
                        rows="4"
                        value={role}
                        onChange={(e) => { setrole(e.target.value) }}
                    />
                </div>
                <div className="form-group">
                    <label><b>Package :</b></label>
                    <textarea
                        className="textarea form-control"
                        rows="2"
                        value={salary}
                        onChange={(e) => { setsalary(e.target.value) }}
                    />
                </div>
                <div className="d-flex justify-content-center pt-3 pb-3">
                    <button
                        disabled={sign}
                        className="btn btn-danger"
                        style={{ width: "40%" }}
                        onClick={Handler}
                    >
                        {post}
                    </button>
                </div>
            </div>
        </Fragment>
    )
}

export default Post
