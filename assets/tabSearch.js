const tabSearch = document.querySelector('#tab_search');
const wrapper = document.querySelector('#wrapper');
const rows = Array.from(wrapper.querySelectorAll('.tab'));

tabSearch.addEventListener('input', () => {
  const searchTerm = tabSearch.value.toLowerCase();
  rows.forEach(row => {
    const name = row.querySelector('td:first-child a').textContent.toLowerCase();
    const similarity = getSimilarity(searchTerm, name);
    row.querySelector('.similarity').textContent = similarity.toFixed(2);
  });
  rows.sort((a, b) => {
    const similarityA = parseFloat(a.querySelector('.similarity').textContent);
    const similarityB = parseFloat(b.querySelector('.similarity').textContent);
    return similarityB - similarityA;
  });
  rows.forEach(row => wrapper.appendChild(row));
});

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