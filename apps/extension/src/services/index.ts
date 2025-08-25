const API_URL = import.meta.env.VITE_API_URL;
const X_API_KEY = import.meta.env.VITE_X_API_KEY;

export const search = async (keyword: string) => {
  const queryParams = new URLSearchParams({
    keyword,
  });
  const data = await fetch(`${API_URL}/search?${queryParams}`, {
    headers: {
      "x-api-key": X_API_KEY,
    },
  }).then((data) => data.json());
  return data;
};

export const saveWord = async (id: number) => {
  const data = await fetch(`${API_URL}/save-word`, {
    method: "POST",
    headers: {
      "x-api-key": X_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  }).then((data) => data.json());
  return data;
};
