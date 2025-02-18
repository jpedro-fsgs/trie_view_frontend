"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { RawNodeDatum } from "react-d3-tree";

export type TreeDataType = {
    trie: RawNodeDatum;
    radix: RawNodeDatum;
    connectedUsers: number;
};

interface WebsocketContextType {
    socket: WebSocket | null;
    treeData: TreeDataType;
    isConnected: boolean;
    insertTree: (word: string) => void;
}

const WebsocketContext = createContext<WebsocketContextType | undefined>(
    undefined
);

export const WebsocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [treeData, setTreeData] = useState<TreeDataType>({
        trie: {
            name: "Root",
            children: [],
        },
        radix: {
            name: "Root",
            children: [],
        },
        connectedUsers: 0,
    });

    useEffect(() => {
        const ws = new WebSocket(
            `${
                process.env.WS_URL || `ws://${window.location.hostname}:8000`
            }/public_tree/ws`
        );
        setSocket(ws);

        ws.onmessage = (event) => {
            setTreeData(JSON.parse(event.data));
        };

        ws.onopen = () => {
            console.log("WebSocket connection opened");
            setIsConnected(true);
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
            setIsConnected(false);
        };

        return () => {
            ws.close();
        };
    }, []);

    function insertTree(word: string) {
        fetch(
            `${
                process.env.API_URL || `http://${window.location.hostname}:8000`
            }/public_tree/insert/${word}`,
            {
                method: "POST",
            }
        )
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 403) {
                        alert("Word insertion currently blocked.");
                    } else {
                        throw new Error(
                            `HTTP error! Status: ${response.status}`
                        );
                    }
                }
                return response.json();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <WebsocketContext.Provider
            value={{ socket, treeData, isConnected, insertTree }}
        >
            {children}
        </WebsocketContext.Provider>
    );
};

export const useWebsocket = () => {
    const context = useContext(WebsocketContext);
    if (!context) {
        throw new Error(
            "useWebsocket deve ser usado dentro de um WebsocketProvider"
        );
    }
    return context;
};
