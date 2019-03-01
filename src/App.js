import React, { Component } from "react";
import Client from "./components/obs";

import Login from "./components/login";
import Dashboard from "./components/dashboard";

class App extends Component {
    state = {
        client: new Client(),
        connected: false,
        authFail: false,
        error: null
    };

    async componentDidMount() {
        this.state.client.on("connected", () => {
            this.setState({ connected: true, authFail: false, error: null });
        });

        this.state.client.on("authfail", () => {
            this.setState({ connected: false, authFail: true, error: "" });
        });

        this.state.client.on("error", error => {
            if (error.code === 1006) {
                this.setState({ error: "Can't connect to websocket", connected: false });
                return;
            }

            console.log(error);
        });
    }

    render() {
        {
            return !this.state.connected ? <Login {...this.state} /> : <Dashboard {...this.state} />;
        }
    }
}

export default App;
