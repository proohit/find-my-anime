export const Api = {
  getAnimeById: (id: string) => {
    const url = new URL("http://localhost:3000/api");
    url.searchParams.append("id", id);
    return fetch(url.toString(), {})
      .then((response) => response.json())
      .then((json) => json);
  },
};
