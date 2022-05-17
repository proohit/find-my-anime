import { Provider } from "@find-my-anime/shared/constants/Provider";
import { Anime } from "@find-my-anime/shared/interfaces/AnimeDb";

class AnimeApi {
  private SERVER_URL =
    import.meta.env.MODE === "development" ? "http://localhost:3000/" : "/";

  public queryAnime = async (
    query?: string,
    id?: string,
    provider?: Provider
  ): Promise<Anime[]> => {
    const url = new URL(`${this.SERVER_URL}api`);
    if (query) {
      url.searchParams.append("query", query.replace(/\s/g, "%20"));
    }
    if (id) {
      url.searchParams.append("id", id);
    }
    if (provider) {
      url.searchParams.append("provider", provider);
    }
    const response = await fetch(url.toString(), {});
    return response.json();
  };
}

export default new AnimeApi();
