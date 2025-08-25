import { useState, type ChangeEvent } from "react";
import "./App.css";
import { SearchInput } from "./components/search-input";
import { WordItem } from "./components/word-item";
import { saveWord, search } from "./services";
import type { Word } from "./types";

function App() {
  const [keyword, setKeyword] = useState<string>("");
  const [wordList, setWordList] = useState<Word[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSearch = async (keyword: string) => {
    setIsSearching(true);
    try {
      const { data } = await search(keyword);
      setWordList(data);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveWord = async (word: Word) => {
    setIsSaving(true);
    try {
      await saveWord(word.id);
      setWordList(
        wordList.map((wordState) => {
          if (wordState.id === word.id) {
            return { ...word, isSaved: true };
          } else {
            return wordState;
          }
        })
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ minWidth: "300px" }}>
      <div>
        <SearchInput
          value={keyword}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setKeyword(event.target.value)
          }
          isLoading={isSearching}
          onSubmit={() => handleSearch(keyword)}
        />
      </div>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {wordList &&
          wordList.map((word) => (
            <div key={word.id}>
              <WordItem
                word={word}
                isSaving={isSaving}
                onSave={(word) => handleSaveWord(word)}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
