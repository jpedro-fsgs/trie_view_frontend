"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";

function WordsList() {
    const [word, setWord] = useState("");
    const [wordsList, setWordsList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (word.length > 2) {
            setIsLoading(true);

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
                })
                .finally(() => {
                    setTimeout(() => setIsLoading(false), 5000);
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
                    { "invisible": wordsList.length === 0 && !isLoading }
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
                rows={16}
                className="w-full p-3 text-lg border border-gray-300 rounded-lg shadow-sm mt-4"
            />
        </div>
    );
}

export default WordsList;
