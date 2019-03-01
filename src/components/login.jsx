import React, { Component } from "react";

class Login extends Component {
    state = {
        host: "localhost",
        port: "4444",
        password: ""
    };

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = e => {
        this.props.client.connect(`${this.state.host}:${this.state.port}`, this.state.password);
        e.preventDefault();
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Host:
                    <input name="host" type="text" value={this.state.host} onChange={this.handleChange} />
                </label>
                <label>
                    Port:
                    <input name="port" type="text" value={this.state.port} onChange={this.handleChange} />
                </label>
                <label>
                    Password:
                    <input name="password" type="text" value={this.state.password} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export default Login;
