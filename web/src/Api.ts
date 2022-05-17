import { Provider } from "@find-my-anime/shared/constants/Provider";
import { Anime } from "@find-my-anime/shared/interfaces/AnimeDb";
import { SERVER_BASE, SERVER_PATH } from "./urls";

class AnimeApi {
  public queryAnime = async (
    id?: string,
    query?: string,
    provider?: Provider,
    tags?: string[]
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
    if (tags) {
      url.searchParams.append("tags", tags.join(","));
    }
    const response = await fetch(url.toString(), {});
    return response.json();
  };

  public getTags = async (): Promise<string[]> => {
    const url = new URL(SERVER_PATH + "/tags", SERVER_BASE);
    const response = await fetch(url.toString(), {});
    return response.json();
  };
}

export default new AnimeApi();
