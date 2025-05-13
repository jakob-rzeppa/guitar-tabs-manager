import { Controller } from '@hotwired/stimulus';
import { calculateSimilarity } from '../util/similartiy.js';

/*
 * This is an example Stimulus controller!
 *
 * Any element with a data-controller="tab-search" attribute will cause
 * this controller to be executed. The name "tab-search" comes from the filename:
 * tab_search_controller.js -> "tab-search"
 *
 * Delete this file or adapt it for your use!
 */
export default class extends Controller {
    static targets = ['tabSearchInput', 'tabItem', 'tabsContainer', 'filterByTagsInput', 'tagsAutocomplete', 'filterByArtistInput', 'artistAutocomplete'];

    connect() {
        this.orderTagSuggestions();
        this.orderArtistSuggestions();
    }

    search() {
        const searchValue = this.tabSearchInputTarget.value.toLowerCase();
        const tabItems = Array.from(this.tabItemTargets);

        tabItems.sort((a, b) => {
            const titleA = a.dataset.title.toLowerCase();
            const titleB = b.dataset.title.toLowerCase();
            return (
                calculateSimilarity(searchValue, titleB) -
                calculateSimilarity(searchValue, titleA)
            );
        });

        tabItems.forEach(tab => this.tabsContainerTarget.appendChild(tab));
    }

    orderTagSuggestions() {
        const tagInputValueArray = this.filterByTagsInputTarget.value.toLowerCase().split(',').map(tag => tag.trim());
        const searchValue = tagInputValueArray[tagInputValueArray.length - 1];
        const tagItems = Array.from(this.tagsAutocompleteTarget.querySelectorAll('div'));

        tagItems.sort((a, b) => {
            const nameA = a.dataset.name.toLowerCase();
            const nameB = b.dataset.name.toLowerCase();
            return (
                calculateSimilarity(searchValue, nameB) -
                calculateSimilarity(searchValue, nameA)
            );
        });

        tagItems.sort((a, b) => {
            const isHiddenA = a.style.display === 'none';
            const isHiddenB = b.style.display === 'none';
            return isHiddenA - isHiddenB;
        });

        tagItems.forEach(tag => this.tagsAutocompleteTarget.appendChild(tag));

        this.filterByTags();
        this.displayOnlyNonSelectedTagSuggestions();
    }

    orderArtistSuggestions() {
        const artistInputValue = this.filterByArtistInputTarget.value.toLowerCase();
        const artistItems = Array.from(this.artistAutocompleteTarget.querySelectorAll('div'));

        artistItems.sort((a, b) => {
            const nameA = a.dataset.name.toLowerCase();
            const nameB = b.dataset.name.toLowerCase();
            return (
                calculateSimilarity(artistInputValue, nameB) -
                calculateSimilarity(artistInputValue, nameA)
            );
        });

        artistItems.sort((a, b) => {
            const isHiddenA = a.style.display === 'none';
            const isHiddenB = b.style.display === 'none';
            return isHiddenA - isHiddenB;
        });

        artistItems.forEach(artist => this.artistAutocompleteTarget.appendChild(artist));

        this.filterByArtist();
        this.displayOnlyNonSelectedArtistSuggestions();
    }

    selectTag(event) {
        const selectedTag = event.currentTarget.dataset.name;
        const possibleTags = this.tagsAutocompleteTarget.dataset.tags.split(',').map(tag => tag.trim());

        const filterByTagInputValueArray = this.filterByTagsInputTarget.value.split(',').map(tag => tag.trim());

        if (!possibleTags.includes(filterByTagInputValueArray[filterByTagInputValueArray.length - 1])) {
            filterByTagInputValueArray.pop();
        }

        filterByTagInputValueArray.push(selectedTag);
        this.filterByTagsInputTarget.value = filterByTagInputValueArray.join(', ');

        this.filterByTags();
        this.displayOnlyNonSelectedTagSuggestions();
    }

    selectTagFromInput() {
        const selectedTag = Array.from(this.tagsAutocompleteTarget.querySelectorAll('div'))
            .find(tag => tag.style.display === 'block');

        if (!selectedTag) return;

        const selectedTagName = selectedTag.dataset.name;

        const possibleTags = this.tagsAutocompleteTarget.dataset.tags.split(',').map(tag => tag.trim());

        const filterByTagInputValueArray = this.filterByTagsInputTarget.value.split(',').map(tag => tag.trim());

        if (!possibleTags.includes(filterByTagInputValueArray[filterByTagInputValueArray.length - 1])) {
            filterByTagInputValueArray.pop();
        }

        filterByTagInputValueArray.push(selectedTagName);
        this.filterByTagsInputTarget.value = filterByTagInputValueArray.join(', ');

        this.filterByTags();
        this.displayOnlyNonSelectedTagSuggestions();
    }

    selectArtist(event) {
        const selectedArtist = event.currentTarget.dataset.name;

        this.filterByArtistInputTarget.value = selectedArtist;

        this.filterByArtist();
        this.displayOnlyNonSelectedArtistSuggestions();
    }

    selectArtistFromInput() {
        const selectedArtist = Array.from(this.artistAutocompleteTarget.querySelectorAll('div'))
            .find(artist => artist.style.display === 'block');

        if (!selectedArtist) return;

        const selectedArtistName = selectedArtist.dataset.name;

        this.filterByArtistInputTarget.value = selectedArtistName;

        this.filterByArtist();
        this.displayOnlyNonSelectedArtistSuggestions();
    }

    filterByTags() {
        const tagInputValueArray = this.filterByTagsInputTarget.value.split(',').map(tag => tag.trim());
        const possibleTags = this.tagsAutocompleteTarget.dataset.tags.split(',').map(tag => tag.trim());
        const tabItems = Array.from(this.tabItemTargets);

        tabItems.forEach(tab => {
            const tags = tab.dataset.tags.split(',').map(tag => tag.trim());
            const isVisible = tagInputValueArray.every(tag => possibleTags.includes(tag) ? tags.includes(tag) : true);
            tab.style.display = isVisible ? 'block' : 'none';
        });
    }

    filterByArtist() {
        const artistInputValue = this.filterByArtistInputTarget.value.trim();
        const possibleArtists = this.artistAutocompleteTarget.dataset.artists.split(',').map(artist => artist.trim());
        const tabItems = Array.from(this.tabItemTargets);

        tabItems.forEach(tab => {
            const artist = tab.dataset.artist.trim();
            const isVisible = possibleArtists.includes(artistInputValue) ? artist === artistInputValue : true;
            tab.style.display = isVisible ? 'block' : 'none';
        });
    }

    displayOnlyNonSelectedTagSuggestions() {
        const tagInputValueArray = this.filterByTagsInputTarget.value.split(',').map(tag => tag.trim());
        const tagItems = Array.from(this.tagsAutocompleteTarget.querySelectorAll('div'));

        tagItems.forEach(tag => {
            const tagName = tag.dataset.name;
            const isSelected = tagInputValueArray.includes(tagName);
            tag.style.display = isSelected ? 'none' : 'block';
        });
    }

    displayOnlyNonSelectedArtistSuggestions() {
        const artistInputValue = this.filterByArtistInputTarget.value;
        const artistItems = Array.from(this.artistAutocompleteTarget.querySelectorAll('div'));

        artistItems.forEach(artist => {
            const artistName = artist.dataset.name;
            const isSelected = artistInputValue === artistName;
            artist.style.display = isSelected ? 'none' : 'block';
        });
    }
}
