import { Provider } from "@find-my-anime/shared/constants/Provider";
import { Anime } from "@find-my-anime/shared/interfaces/AnimeDb";
import { DbStatistics } from "@find-my-anime/shared/interfaces/DbStatistics";
import { SERVER_BASE, SERVER_PATH } from "./constants/urls";

class AnimeApi {
  public queryAnime = async (
    id?: string,
    query?: string,
    provider?: Provider,
    tags?: string[],
    includeAdult?: boolean
  ): Promise<Anime[]> => {
    const url = `${SERVER_BASE}${SERVER_PATH}`;
    const params = new URLSearchParams();
    if (query) {
      params.append("query", query);
    }
    if (id) {
      params.append("id", id);
    }
    if (provider) {
      params.append("provider", provider);
    }
    if (tags) {
      params.append("tags", tags.join(","));
    }
    if (includeAdult) {
      params.append("includeAdult", includeAdult.toString());
    }
    const response = await fetch(`${url}?${params.toString()}`);
    return response.json();
  };

  public getTags = async (): Promise<string[]> => {
    const url = `${SERVER_BASE}${SERVER_PATH}/tags`;
    const response = await fetch(url);
    return response.json();
  };

  public getStats = async (): Promise<DbStatistics> => {
    const url = `${SERVER_BASE}${SERVER_PATH}/stats`;
    const response = await fetch(url);
    return response.json();
  };
}

export default new AnimeApi();
