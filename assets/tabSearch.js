const tabSearch = document.querySelector('#tab_search');
const wrapper = document.querySelector('#wrapper');
const tabs = Array.from(wrapper.querySelectorAll('.tab'));

tabSearch.addEventListener('input', () => {
  const searchTerm = tabSearch.value.toLowerCase();

  tabs.forEach(row => {
    const name = row.querySelector('td:first-child a').textContent.toLowerCase();
    const similarity = getSimilarity(searchTerm, name);
    row.dataset.similarity = similarity.toFixed(2);
  });
  tabs.sort((a, b) => {
    const similarityA = parseFloat(a.dataset.similarity);
    const similarityB = parseFloat(b.dataset.similarity);
    return similarityB - similarityA;
  });
  tabs.forEach(row => wrapper.appendChild(row));
});

/**
 * Calculates the similarity between two strings based on the Levenshtein distance.
 * The similarity is a value between 0 and 1, where 1 means the strings are identical.
 *
 * @param {string} a - The first string to compare.
 * @param {string} b - The second string to compare.
 * @returns {number} A value between 0 and 1 representing the similarity between the two strings.
 */
function getSimilarity(a, b) {
  let longer = a;
  let shorter = b;
  if (a.length < b.length) {
    longer = b;
    shorter = a;
  }
  const longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

/**
 * Calculates the Levenshtein distance (edit distance) between two strings.
 * The Levenshtein distance is a measure of the difference between two sequences.
 * It is the minimum number of single-character edits (insertions, deletions, or substitutions)
 * required to change one string into the other.
 *
 * @param {string} s1 - The first string to compare.
 * @param {string} s2 - The second string to compare.
 * @returns {number} The Levenshtein distance between the two strings.
 */
function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1[i - 1] !== s2[j - 1]) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) {
      costs[s2.length] = lastValue;
    }
  }
  return costs[s2.length];
}