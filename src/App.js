import React, { Component } from "react";
import Client from "./components/obs";

import Login from "./components/login";
import dashboard from "./components/dashboard";

class App extends Component {
    state = {
        client: new Client(),
        connected: false,
        authFail: false
    };

    async componentDidMount() {
        this.state.client.on("connected", () => {
            this.setState({ connected: true, authFail: false });
        });

        this.state.client.on("authfail", () => {
            this.setState({ connected: false, authFail: true });
        });
    }

    render() {
        return <Login {...this.state} />;
    }
}

export default App;
