import { Component, computed, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Provider } from '@find-my-anime/shared';

export interface AddedTag {
  name: string;
  excluded: boolean;
}

export type FilterForm = {
  title: string;
  id: string;
  provider: Provider | null;
  tags: AddedTag[];
  tagSearch: string;
};

@Component({
  selector: 'app-search-box',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatRippleModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
    FormField,
  ],
  templateUrl: './search-box.html',
  styleUrl: './search-box.scss',
})
export class SearchBox {
  readonly onSearch = output<FilterForm>();
  readonly tags = signal([
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Fantasy',
    'Horror',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Slice of Life',
  ]);
  readonly initialState: FilterForm = {
    title: '',
    id: '',
    provider: null,
    tags: [] as AddedTag[],
    tagSearch: '',
  };

  readonly searchModel = signal<FilterForm>(this.initialState);
  readonly searchForm = form(this.searchModel);

  readonly filteredTags = computed(() => {
    const searchTerm = this.searchForm.tagSearch();
    const existingTags = this.searchForm.tags().value();

    return this.tags().filter(
      (tag) =>
        tag.toLowerCase().includes(searchTerm.value().toLowerCase()) &&
        !existingTags.find((t: AddedTag) => t.name === tag),
    );
  });

  search(e: SubmitEvent) {
    e.preventDefault();
    this.onSearch.emit(this.searchForm().value());
  }

  addTag(tag: string) {
    this.searchForm
      .tags()
      .value.update((tags) => [
        ...tags.filter((currentTag: AddedTag) => currentTag.name !== tag),
        { name: tag, excluded: false },
      ]);
    if (this.filteredTags().length <= 1) {
      this.searchForm.tagSearch().value.set('');
    }
  }

  excludeTag(tag: string) {
    this.searchForm
      .tags()
      .value.update((tags) => [
        ...tags.filter((currentTag: AddedTag) => currentTag.name !== tag),
        { name: tag, excluded: true },
      ]);
    if (this.filteredTags().length <= 1) {
      this.searchForm.tagSearch().value.set('');
    }
  }

  removeTag(tag: string) {
    this.searchForm
      .tags()
      .value.update((tags) => tags.filter((currentTag: AddedTag) => currentTag.name !== tag));
  }
}
