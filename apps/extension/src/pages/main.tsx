import { Input } from "@/components/ui/input";
import { WordItem } from "@/components/word-item";
import { wordListOptions } from "@/queries/query-options";
import { saveWord } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ChangeEvent } from "react";
import { useDebounceValue } from "usehooks-ts";

export const MainPage = () => {
  const queryClient = useQueryClient();

  const [debouncedKeyword, setKeyword] = useDebounceValue("", 500);
  const { data, isLoading, isError } = useQuery(
    wordListOptions(debouncedKeyword)
  );

  const mutation = useMutation({
    mutationFn: saveWord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["word-list"] });
    },
  });

  return (
    <div className="min-w-[300px] p-4">
      <div>
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setKeyword(event.target.value)
          }
        />
      </div>
      <div className="mt-4 flex flex-col gap-4 border border-gray-200 p-4">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error fetching data</p>}
        {data &&
          data.data.map((word) => (
            <div key={word.id}>
              <WordItem
                word={word}
                isSaving={mutation.isPending}
                onSave={(word) => mutation.mutate(word.id)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};
