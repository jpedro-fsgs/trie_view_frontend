"use client";

import React, { useEffect, useRef, useState } from "react";
import Tree, { Orientation } from "react-d3-tree";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { TreeDataType, useWebsocket } from "@/context/WebsocketContext";
import { cn } from "@/lib/utils";
import SearchDrawer from "./SearchDrawer";
import { RotateCwIcon } from "lucide-react";

function TreeView({ treeType }: { treeType: string }) {
    const [dimensions, setDimensions] = useState<{
        width: number;
        height: number;
    } | null>(null);

    const [inputError, setInputError] = useState(false);
    const [orientation, setOrientation] = useState<Orientation>("vertical");

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
        const word = inputRef.current?.value.trim();
        if (!word || word.length > 15 || word.includes(" ")) {
            setInputError(true);
            setTimeout(() => setInputError(false), 1000);
            return;
        }

        insertTree(word);

        inputRef.current!.value = "";
    }

    function handleToggleOrientation() {
        setOrientation((o) => (o == "vertical" ? "horizontal" : "vertical"));
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
                    orientation={orientation}
                    translate={{ x: dimensions.width / 2, y: 100 }}
                    transitionDuration={500}
                    
                />
            )}
            <Button
                className="rounded-full size-12 fixed top-20 left-6 md:bottom-6 z-50"
                onClick={handleToggleOrientation}
            >
                <RotateCwIcon />
            </Button>
            <SearchDrawer />
            <div className="fixed bg-background border bottom-0 left-0 right-0 mx-2 md:mx-auto mb-2 flex justify-center items-center gap-3 p-4 max-w-4xl shadow-2xl rounded-md">
                <div className="relative">
                    <div
                        className={cn(
                            "min-w-4 min-h-4 p-1 rounded-full flex items-center justify-center",
                            { "bg-green-600 animate-pulse": isConnected },
                            { "bg-red-600": !isConnected }
                        )}
                    />
                    <div
                        className={cn(
                            "absolute inset-0 p-1 rounded-full flex items-center justify-center",
                            { "bg-green-600 animate-ping": isConnected },
                            { hidden: !isConnected }
                        )}
                    />
                </div>

                <Input
                    className={cn(
                        "bg-secondary p-2 rounded-l-lg border border-gray-300",
                        { "animate-shake text-destructive": inputError }
                    )}
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
