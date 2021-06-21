import React, { Fragment } from 'react';
import "./common.css";

function Navbar() {
    return (
        <Fragment>
            <div className="navbar text-light sticky">
                <div className="ml-4">
                    <span><b>Domaincer Web</b></span>
                    <br></br>
                    <small>A website for recurite</small>
                </div>
            </div>
        </Fragment>
    )
}

export default Navbar
