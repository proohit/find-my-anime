import { Provider } from "@find-my-anime/shared/constants/Provider";
import { Anime } from "@find-my-anime/shared/interfaces/AnimeDb";

class AnimeApi {
  private SERVER_BASE =
    import.meta.env.MODE === "development"
      ? "http://localhost:3004"
      : `https://${window.location.host}`;
  private SERVER_PATH = "/api";

  public queryAnime = async (
    query?: string,
    id?: string,
    provider?: Provider
  ): Promise<Anime[]> => {
    const url = new URL(this.SERVER_PATH, this.SERVER_BASE);
    if (query) {
      url.searchParams.append("query", query);
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
