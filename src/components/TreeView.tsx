"use client";

import React, { useEffect, useRef, useState } from "react";
import Tree from "react-d3-tree";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { TreeDataType, useWebsocket } from "@/context/WebsocketContext";
import { cn } from "@/lib/utils";

function TreeView({ treeType }: { treeType: string }) {
    const [dimensions, setDimensions] = useState<{
        width: number;
        height: number;
    } | null>(null);

    const [inputError, setInputError] = useState(false);

    const { treeData, insertTree, isConnected } = useWebsocket();

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Ajusta o tamanho inicial

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const inputRef = useRef<HTMLInputElement>(null);

    function handleInsert() {
        const word = inputRef.current?.value;
        if (!word || word.trim().includes(" ")){
            setInputError(true);
            setTimeout(() => setInputError(false), 1000);
            return;
        }

        insertTree(word);

        inputRef.current!.value = "";
    }

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                handleInsert();
            }
        };

        const inputElement = inputRef.current;
        if (inputElement) {
            inputElement.addEventListener("keypress", handleKeyPress);
        }

        return () => {
            if (inputElement) {
                inputElement.removeEventListener("keypress", handleKeyPress);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputRef]);

    const treeTypeKey = treeType as Exclude<
        keyof TreeDataType,
        "connectedUsers"
    >;

    return (
        <>
            {dimensions && treeData && (
                <Tree
                    data={treeData[treeTypeKey]}
                    orientation="vertical"
                    translate={{ x: dimensions.width / 2, y: 100 }}
                    transitionDuration={500}
                />
            )}
            <div className="fixed bg-background border bottom-0 left-0 right-0 mx-2 md:mx-auto mb-2 flex justify-center items-center gap-3 p-4 max-w-4xl shadow-2xl rounded-md">
                <div
                    className={cn(
                        "text-white min-w-5 min-h-5 p-1 rounded-full flex items-center justify-center",
                        { "bg-green-600 animate-pulse": isConnected },
                        { "bg-red-600": !isConnected }
                    )}
                />
                    {/* {isConnected && treeData.connectedUsers} */}

                <Input
                    className={cn("bg-secondary p-2 rounded-l-lg border border-gray-300", {"animate-shake": inputError})}
                    ref={inputRef}
                    disabled={!isConnected}
                    placeholder="Enter a word"
                />
                <Button variant="default" onClick={handleInsert}>
                    Insert
                </Button>
            </div>
        </>
    );
}

export default TreeView;
