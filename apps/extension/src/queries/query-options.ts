import { queryOptions } from "@tanstack/react-query";
import { search } from "../services";

export const wordListOptions = (keyword: string) => {
  return queryOptions({
    queryKey: ["word-list", keyword],
    queryFn: () => search(keyword),
    enabled: Boolean(keyword),
  });
};
