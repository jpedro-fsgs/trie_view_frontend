import React, { useEffect, useState } from "react";
import {
    Sheet,
    // SheetClose,
    SheetContent,
    // SheetDescription,
    // SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

function SearchSheet() {
    const [word, setWord] = useState("");
    const [wordsList, setWordsList] = useState([]);

    useEffect(() => {
        if (word) {
            fetch(
                `${
                    process.env.API_URL ||
                    `http://${window.location.hostname}:8000`
                }/public_tree/matches/${word}`
            )
                .then((response) => response.json())
                .then((data) => {
                    setWordsList(data.words);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);

                })
        } else {
            setWordsList([]);
        }
    }, [word]);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="rounded-full size-12 fixed bottom-24 right-8 md:bottom-6 z-50"><SearchIcon /></Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle className="text-center">
                        Search Word
                    </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col items-center p-4 max-w-lg mx-auto">
                    <Input
                        value={word}
                        onChange={(e) => setWord(e.target.value.trim())}
                        placeholder="Enter a word"
                        className="w-full mb-4 p-2 text-lg"
                    />
                    <Textarea
                        value={wordsList.join("\n")}
                        readOnly
                        rows={10}
                        className="w-full h-full p-2 text-lg"
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default SearchSheet;
