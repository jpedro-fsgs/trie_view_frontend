"use client";

import React, { useEffect, useRef, useState } from "react";
import Tree, { RawNodeDatum } from "react-d3-tree";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

function TreeView() {
    const [dimensions, setDimensions] = useState<{
        width: number;
        height: number;
    } | null>(null);
    const [tree, setTree] = useState<RawNodeDatum>({
        name: "Root",
        children: [],
    });

    const fetchTreeData = async () => {
        try {
            const response = await fetch("http://localhost:8000/tree");
            const data = await response.json();
            setTree(data);
        } catch (error) {
            console.error("Error fetching tree data:", error);
        }
    };

    useEffect(() => {
        fetchTreeData();
        const intervalId = setInterval(fetchTreeData, 5000);

        return () => clearInterval(intervalId);
    }, []);

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
        if (!inputRef.current || inputRef.current.value.trim().split(" ").length > 1)
            return;
        const word = inputRef.current.value;

        fetch(`http://localhost:8000/insert/${word}`, {
            method: "POST",
        })
            .then((response) => response.json())
            .then((data) => {
                setTree(data);
                fetchTreeData();
                inputRef.current!.value = "";
            })

            .catch((error) => {
                console.error("Error inserting word:", error);
            });
            
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
    }, [inputRef]);

    return (
        <>
            {dimensions && tree && (
                <Tree
                    data={tree}
                    orientation="vertical"
                    translate={{ x: dimensions.width / 2, y: 100 }}
                />
            )}
            <div className="fixed bottom-0 left-0 right-0 m-auto flex justify-center p-4 bg-white max-w-4xl shadow-lg rounded-lg">
                <Input className="bg-secondary p-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" ref={inputRef} placeholder="Enter a word" />
                <Button className="ml-2 p-2 rounded-r-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" variant="default" onClick={handleInsert}>
                    Insert
                </Button>
            </div>
        </>
    );
}

export default TreeView;
