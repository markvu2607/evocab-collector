import type { Word } from "../types";

type Props = {
  word: Word;
  isSaving: boolean;
  onSave: (word: Word) => void;
};

export const WordItem = ({ word, isSaving, onSave }: Props) => {
  return (
    <div
      style={{
        textAlign: "start",
        padding: "4px",
      }}
    >
      <p style={{ fontWeight: "bold", fontSize: "24px", margin: 0 }}>
        {word.trans}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "8px",
          alignItems: "start",
        }}
      >
        <div>
          <p>
            <b>
              {word.content} ({word.position})
            </b>
          </p>
          <p>
            {word.en_sentence} ({word.vi_sentence})
          </p>
        </div>
        <button
          disabled={word.isSaved || isSaving}
          onClick={() => onSave(word)}
        >
          Save
        </button>
      </div>
    </div>
  );
};
