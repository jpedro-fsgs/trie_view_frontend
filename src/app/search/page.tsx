"use client";

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React, { useState, useEffect } from 'react'

const API_BASE_URL = "https://api.trieview.myouijava.tech";
// const API_BASE_URL = "http://localhost:8000";

function Page() {
  const [word, setWord] = useState('')
  const [wordsList, setWordsList] = useState([])

  useEffect(() => {
    if (word) {
      fetch(`${API_BASE_URL}/match/${word}`)
        .then(response => response.json())
        .then(data => setWordsList(data.results))
        .catch(error => console.error('Error fetching data:', error))
    } else {
      setWordsList([])
    }
  }, [word])

  return (
    <div className="flex flex-col items-center p-4 max-w-lg mx-auto">
      <Input 
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Enter a word"
        className="w-full mb-4 p-2 text-lg"
      />
      <Textarea 
        value={wordsList.join('\n')}
        readOnly
        rows={10}
        className="w-full p-2 text-lg"
      />
    </div>
  )
}

export default Page