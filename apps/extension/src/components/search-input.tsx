import type { ChangeEvent } from "react";

type Props = {
  value: string;
  isLoading: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
};

export const SearchInput = ({
  value,
  isLoading,
  onChange,
  onSubmit,
}: Props) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
      }}
    >
      <input
        style={{ flex: "1", height: "24px" }}
        type="text"
        value={value}
        autoFocus
        onChange={onChange}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onSubmit();
          }
        }}
      />
      <button type="button" disabled={isLoading} onClick={onSubmit}>
        {isLoading ? "Loading..." : "Search"}
      </button>
    </div>
  );
};
