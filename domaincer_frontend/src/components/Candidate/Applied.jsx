import React, { Fragment, useEffect, useState } from 'react'

function Applied() {

    const [data, setdata] = useState([]);

    const token = localStorage.getItem("token");

    const fulldate = () => {
        let d = new Date();
        let year = d.toLocaleDateString().split("/").splice(2, 1);
        let month = d.toLocaleDateString().split("/").splice(0, 2).reverse();
        let full = month.concat(year).join("/");
        return full;
    }

    useEffect(() => {

        fetch(`https://domaincer-backend.herokuapp.com/candidate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: token
            },
            body: JSON.stringify({
                date: fulldate(),
                time: new Date().toLocaleTimeString()
            })
        })
            .then(res => { return res.json() })
            .then(res => {
                console.log(res)
                if (res.data) {
                    setdata(res.data);
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
                    <div key={index} className="mt-4 mb-4">
                        {item.Data.map((i, ind) => {
                            return (
                                <div>
                                    <div key={ind} className="gridify">
                                        <span className="ml-3"><b>Company Name : </b><span className="ml-3">{i.Name}</span></span>
                                        <span className="marginy"><b>Applied Date : </b><span className="ml-3">{i.newdate}</span></span>
                                        <span className="marginy"><b>Applied Time : </b><span className="ml-3">{i.newtime}</span></span>
                                        <span className="marginy" ><b>status :</b><span className="ml-3"> Completed</span></span>
                                    </div>
                                    <div className="lining"></div>
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </Fragment>
    )
}

export default Applied
