import React, { Fragment } from "react";
import "./common.css";
import { useHistory } from "react-router-dom";
import Navbar from "./Navbar";

const Home = () => {

    const history = useHistory();

    const Type = (param) => {
        history.push(`/register/${param}`)
    }

    return (
        <Fragment>
            <Navbar />
            <div className="center rename">
                <h4 className="mid">
                    <span>Are you a recuirter and want to Post a Job?</span>
                    <small className="text" onClick={() => { Type("poster") }}><b>Click here to Post a Job recuirments</b></small>
                </h4>
                <h2 className="mid">[OR]</h2>
                <h4 className="mid">
                    <span>Are you a Job Seeker?</span>
                    <small className="text" onClick={() => { Type("seeker") }}><b>Click here to get a Job recuirments</b></small>
                </h4>
            </div>
        </Fragment>
    )
}
export default Home;