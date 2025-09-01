import { useEffect, useState } from "react";
import io from "socket.io-client";

interface ISocket{
    SERVER_URL: string | undefined;
}

function SocketClient({SERVER_URL}: ISocket) {
    const socket = io.call(SERVER_URL);

    const [serverMessage, setServerMessage] = useState("");

    useEffect(() => {
        socket.on("server_message", (data) => {
            setServerMessage(data);
        });

    }, [socket,serverMessage]);


    return (
        <div>
            <h1> Message from server : {serverMessage} </h1>
        </div>
    );
}

export default SocketClient;