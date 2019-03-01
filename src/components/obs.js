import EventEmitter from "events";
import shajs from "sha.js";

class OBSwebsocket extends EventEmitter {
    constructor() {
        super();

        this.messageId = 0;
        this.address = "";
        this.password = "";
    }

    connect(address, password) {
        this.address = address;
        this.password = password;

        this.ws = new WebSocket(`ws://${address}`);

        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onerror = this.onError.bind(this);
        this.ws.onclose = this.onClose.bind(this);
    }

    async onOpen() {
        if (this.ws !== null && this.ws.readyState === 1) {
            console.log("Successfully Connected to OBS");

            const res = await this.send({ "request-type": "GetAuthRequired" });

            if (res.authRequired) {
                this.authenticate(res);
            } else {
                this.emit("connected");
            }
        }
    }

    onClose(e) {
        this.emit("error", e);
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }

    onError(e) {
        this.emit("error", e);
    }

    onMessage(message) {
        const data = JSON.parse(message.data);

        console.log("onmessageeee", data);

        if (data["message-id"]) {
            this.emit(`messageId-${data["message-id"]}`, data);
        } else {
            this.emit(data["update-type"], data);
        }
    }

    send(message) {
        return new Promise((resolve, reject) => {
            const id = this.generateMessageId();
            message["message-id"] = id;

            this.once(`messageId-${id}`, data => {
                if (data.status === "error") {
                    reject(data);
                }

                resolve(data);
            });

            this.ws.send(JSON.stringify(message));
        });
    }

    generateMessageId() {
        return String(this.messageId++);
    }

    async authenticate({ salt, challenge }) {
        const passwordSaltHash = new shajs.sha256().update(this.password + salt).digest("base64");
        const authResponse = new shajs.sha256().update(passwordSaltHash + challenge).digest("base64");

        try {
            await this.send({ "request-type": "Authenticate", auth: authResponse });
            this.emit("connected");
        } catch (error) {
            this.emit("authfail");
        }
    }
}

export default OBSwebsocket;
