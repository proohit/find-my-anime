import { Provider } from "@find-my-anime/shared/constants/Provider";
import { Anime } from "@find-my-anime/shared/interfaces/AnimeDb";
import { SERVER_PATH, SERVER_BASE } from "./urls";

class AnimeApi {
  public queryAnime = async (
    query?: string,
    id?: string,
    provider?: Provider
  ): Promise<Anime[]> => {
    const url = new URL(SERVER_PATH, SERVER_BASE);
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
