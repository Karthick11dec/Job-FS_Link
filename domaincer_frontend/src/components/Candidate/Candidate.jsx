import React, { useState } from 'react';
import './candidate.css';
import Navbar1 from "./Navbar1";
import Applied from "./Applied";
import Newjob from "./Newjob";

function Candidate() {

    const [value, setvalue] = useState("");

    const Set = (param) => {
        setvalue(param);
    }

    return (
        <div>
            <Navbar1 set={Set} />
            {value !== "applied" ? <Newjob /> : <Applied /> }
        </div>
    )
}

export default Candidate
