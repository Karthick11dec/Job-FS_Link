import React, { Fragment } from 'react';

function Navbar1({ set }) {

    const Logout = () => {
        localStorage.clear();
        alert("Logged Out.");
        window.location.replace("https://domaincer.netlify.app/");
    }

    return (
        <Fragment>
            <div className="navbar text-light sticky">
                <div className="ml-4">
                    <span><b>Domaincer Web</b></span>
                    <br></br>
                    <small>A website for recurite</small>
                </div>
                <div style={{ float: 'right' }} className="mr-3">
                    <div className="btn btn-primary m-2" onClick={() => { set("new") }}>New Jobs</div>
                    <div className="btn btn-primary m-2" onClick={() => { set("applied") }}>Applied Jobs</div>
                    <div className="btn btn-primary m-2" onClick={Logout} >Logout</div>
                </div>
            </div>
        </Fragment>
    )
}

export default Navbar1
