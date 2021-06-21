import React, { Fragment, useEffect, useState } from 'react';
import "./recruiter.css";

function View() {

    const [data, setdata] = useState([]);
    const [submit, setsubmit] = useState([]);

    const token = localStorage.getItem("token");

    useEffect(() => {

        fetch("https://domaincer-backend.herokuapp.com/posted", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: token
            },
        })
            .then(res => { return res.json() })
            .then(res => {
                setdata(res.data);
            })

    }, [token])

    useEffect(() => {

        fetch("https://domaincer-backend.herokuapp.com/recruiter", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: token
            },
        })
            .then(res => { return res.json() })
            .then(res => {
                if (res.data) {
                    setsubmit(res.data);
                }
                else if (res.error) {
                    alert(res.message);
                }
                else {
                    alert(res.message);
                }
            })

    }, [token])

    return (
        <Fragment>
            {data.map((item, index) => {
                return (
                    <div key={index} className="card p-3">
                        <div className="card-header">
                            <details>
                                <summary>
                                    <small><strong>Note : </strong>Want to see the <strong>applicants</strong>,
                                        click the small arrow on top left <strong>and</strong> if it not showcase anything which means no applicants for a job</small>
                                    <div className="pb-2">
                                        <b>Posted Date :</b>
                                        <div className="ml-5">{item.Dates}</div>
                                    </div>
                                    <div className="pb-2">
                                        <b>Job Title :</b>
                                        <div className="ml-5">{item.Title}</div>
                                    </div>
                                </summary>
                                <p className="white">
                                    {submit.filter(i => i.Title === item.Title).map((value, indexes) => {
                                        return (
                                            <div className="p-2">
                                                <div key={indexes} className="grid fullblock">
                                                    <b>{indexes + 1}.</b>
                                                    <span className="ml-3">{value.Name}</span>
                                                    <a href={value.Resume} target="_blank" rel="noreferrer" >Link to my <b>Resume</b></a>
                                                    <a href={value.Portifolio} target="_blank" rel="noreferrer" >Link to my <b>Portifolio</b></a>
                                                    <a href={value.Git} target="_blank" rel="noreferrer" >Link to my <b>Gitrepo</b></a>
                                                    {value.Data.map((it, index) => {
                                                        return (
                                                            <Fragment key={index}>
                                                                <div><b>{it.Dates}</b></div>
                                                                <div><b>{it.Time}</b></div>
                                                            </Fragment>
                                                        )
                                                    })}
                                                </div>
                                                <div className="lining"></div>
                                            </div>
                                        )
                                    })}
                                </p>
                            </details>
                        </div>
                    </div>
                )
            })}
        </Fragment>
    )
}

export default View
