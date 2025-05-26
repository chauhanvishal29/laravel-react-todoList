import React, { useState } from "react";

const App = () => {
    const [name, setName] = useState(null);

    function handleName() {
        setName(name);
        localStorage.setItem("phpinput", name);
    }

    return (
        <div>
            <input
                data-testid="input-id"
                type="text"
                onKeyUp={(e) => setName(e.target?.value)}
            />
        </div>
    );
};

export default App;
