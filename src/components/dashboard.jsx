import React, { Component } from "react";
import annyang from "./annyang.min";

class Dashboard extends Component {
    state = {
        trigger: "obs",
        commands: []
    };

    componentDidMount() {
        if (annyang) {
            // Let's define a command.
            const commands = {
                hello: () => {
                    alert("Hello world!");
                },

                [this.state.trigger + " switch (to) :scene"]: async scene => {
                    try {
                        const res = await this.props.client.send({ "request-type": "SetCurrentScene", "scene-name": scene });
                        console.log("res", res);
                        console.log("switched scene to", scene);
                        res.scene = scene;

                        this.setState(prevState => {
                            return {
                                commands: [...prevState.commands, res]
                            };
                        });
                    } catch (error) {
                        error.scene = scene;

                        this.setState(prevState => {
                            return {
                                commands: [...prevState.commands, error]
                            };
                        });
                    }
                }
            };

            // Add our commands to annyang
            annyang.addCommands(commands);
            annyang.debug(true);

            // annyang.addCallback("resultMatch", (userSaid, commandText, phrases) => {
            //     this.setState(prevState => {
            //         return {
            //             commands: [...prevState.commands, userSaid]
            //         };
            //     });
            // });

            // Start listening.
            annyang.start();
        }
    }

    componentDidUpdate() {
        // would filter() be better?
        if (this.state.commands.length === 10) {
            this.setState(prevState => {
                return {
                    commands: prevState.commands.slice(1)
                };
            });
        }
    }

    render() {
        return (
            <div className="Dashboard">
                <p>Voice control</p>
                {this.state.text && <h2>{this.state.text}</h2>}

                {this.state.commands.map(msg => (
                    <p key={msg["message-id"]}>{JSON.stringify(msg)}</p>
                ))}
            </div>
        );
    }
}

export default Dashboard;
