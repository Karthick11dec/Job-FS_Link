import React, { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import "./candidate.css";

function Newjob() {

    const [data, setdata] = useState([]);

    const token = localStorage.getItem("token");
    const history = useHistory();

    useEffect(() => {

        fetch("https://domaincer-backend.herokuapp.com/getter", {
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

    const View = (id) => {
        history.push(`/${id}`);
    }

    return (
        <Fragment>
            <span type="button" className="sticky1 background">New Jobs ➣ </span>
            {data.map((item, index) => {
                return (
                    <div key={index} className="structure">
                        <div className="card cardclass">
                            <div className="card-header">
                                <div className="ml-3" style={{ float: 'left' }}><b>Posted On : </b>{item.Dates}</div>
                                <div className="mr-3" style={{ float: 'right' }}><b>Posted at : </b>{item.Time}</div>
                            </div>
                            <div className="card-body padd">
                                <p><span><b>Company Name : {item.Name} </b></span></p>
                                <div>
                                    <b>Job Title : </b>
                                    <div className="ml-5">{item.Title}</div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="ml-3" style={{ float: 'left' }}><b>CTC : </b>{item.Ctc}</div>
                                <div className="mr-3" style={{ float: 'right' }}>
                                    <button type="button" className="btn btn-primary" onClick={() => { View(item._id) }}>View and apply</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </Fragment>
    )
}

export default Newjob
