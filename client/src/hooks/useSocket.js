import { useEffect, useState } from "react"

const WS_URL = "https://chess-sable-five.vercel.app/"
export const useSocket = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(WS_URL);
        ws.onopen = () => {
            setSocket(ws);
        }
        ws.onclose = () => {
            setSocket(null);
        }

        return () => {
            ws.close();
        }
    }, [])

    return socket;
}
