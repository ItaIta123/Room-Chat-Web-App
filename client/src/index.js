import React from "react";
import ReactDOM from "react-dom";

import App from "./App"

// injecting our app component into the 'root' div located in public->index.html  
ReactDOM.render(<App />, document.querySelector('#root')); 

