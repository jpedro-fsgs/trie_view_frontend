"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";

function WordsList() {
    const [word, setWord] = useState("");
    const [wordsList, setWordsList] = useState([]);

    useEffect(() => {
        if (word.length > 2 ) {
            fetch(
                `${
                    process.env.API_URL ||
                    `http://${window.location.hostname}:8000`
                }/words_list/matches/${word}`
            )
                .then((response) => response.json())
                .then((data) => {
                    setWordsList(data.words);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        } else {
            setWordsList([]);
        }
    }, [word]);

    return (
        <div className="flex flex-col items-center pt-24 px-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center">
                Words List
            </h2>

            <Input
                value={word}
                onChange={(e) => setWord(e.target.value.trim())}
                placeholder="Enter a word"
                className="w-full p-3 text-lg border border-gray-300 rounded-lg shadow-sm"
            />

            <p
                className={cn(
                    "mt-2 text-sm font-medium text-gray-600 transition-opacity",
                    { "opacity-0": wordsList.length === 0 }
                )}
            >
                {wordsList.length} words found
            </p>

            <Textarea
                value={
                    wordsList.length
                        ? wordsList.join("\n")
                        : word.length > 2
                        ? "No matches"
                        : ""
                }
                readOnly
                rows={10}
                className="w-full p-3 text-lg border border-gray-300 rounded-lg shadow-sm mt-4"
            />
        </div>
    );
}

export default WordsList;
