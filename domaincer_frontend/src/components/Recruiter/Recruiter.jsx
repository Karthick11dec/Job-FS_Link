import React, { useState } from 'react';
import './recruiter.css';
import Navbar from "./Navbar";
import Post from "./Post";
import View from "./View";

function Recruiter() {

    const [value, setvalue] = useState("");

    const Set = (param) => {
        setvalue(param);
    }

    return (
        <div>
            <Navbar set={Set} />
            {value !== "view" ? <Post /> : <View />}
        </div>
    )
}

export default Recruiter
