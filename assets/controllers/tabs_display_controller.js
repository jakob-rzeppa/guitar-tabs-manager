import { Controller } from '@hotwired/stimulus';

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

    search() {
        const searchValue = this.tabSearchInputTarget.value.toLowerCase();
        const tabItems = Array.from(this.tabItemTargets);

        tabItems.sort((a, b) => {
            const titleA = a.dataset.title.toLowerCase();
            const titleB = b.dataset.title.toLowerCase();
            return (
                this.calculateSimilarity(searchValue, titleB) -
                this.calculateSimilarity(searchValue, titleA)
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
                this.calculateSimilarity(searchValue, nameB) -
                this.calculateSimilarity(searchValue, nameA)
            );
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
                this.calculateSimilarity(artistInputValue, nameB) -
                this.calculateSimilarity(artistInputValue, nameA)
            );
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

    selectArtist(event) {
        const selectedArtist = event.currentTarget.dataset.name;

        this.filterByArtistInputTarget.value = selectedArtist;

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

    calculateSimilarity(target, candidate) {
        const distance = this.calculateLevenshteinDistance(target, candidate);
        const maxLength = Math.max(target.length, candidate.length);
        return 1 - distance / maxLength; // Normalize similarity to a value between 0 and 1
    }

    calculateLevenshteinDistance(a, b) {
        const matrix = [];

        // Initialize the matrix
        for (let i = 0; i <= a.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= b.length; j++) {
            matrix[0][j] = j;
        }

        // Fill the matrix
        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                if (a[i - 1] === b[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j] + 1, // Deletion
                        matrix[i][j - 1] + 1, // Insertion
                        matrix[i - 1][j - 1] + 1 // Substitution
                    );
                }
            }
        }

        return matrix[a.length][b.length];
    }
}
