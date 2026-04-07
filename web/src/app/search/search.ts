import { Component, signal } from '@angular/core';
import { FilterForm, SearchBox } from '../search-box/search-box';
import { HttpParams, httpResource } from '@angular/common/http';
import { MaybeLimitedFilterCriteria } from '@find-my-anime/shared';

type SerializableFilterCriteria = Omit<MaybeLimitedFilterCriteria, 'season'> & {
  season?: string;
};

@Component({
  selector: 'app-search',
  imports: [SearchBox],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  searchForm = signal<SerializableFilterCriteria | null>(null);
  searchResultResource = httpResource(() => {
    const searchFormValue = this.searchForm();
    return {
      url: '/api',
      params: searchFormValue
        ? {
            ...searchFormValue,
          }
        : undefined,
    };
  });

  mapFormToCriteria(form: FilterForm): SerializableFilterCriteria {
    return {
      query: form.title,
      id: form.id,
      provider: form.provider ?? undefined,
      tags: form.tags.filter((tag) => !tag.excluded).map((tag) => tag.name),
      excludedTags: form.tags.filter((tag) => tag.excluded).map((tag) => tag.name),
    };
  }
}
