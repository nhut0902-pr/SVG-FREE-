const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsGrid = document.getElementById('resultsGrid');
const loading = document.getElementById('loading');
const noResults = document.getElementById('noResults');

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchIcons(query);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            searchIcons(query);
        }
    }
});

async function searchIcons(query) {
    // Reset UI
    resultsGrid.innerHTML = '';
    loading.classList.remove('hidden');
    noResults.classList.add('hidden');

    try {
        const response = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=32`);
        const data = await response.json();

        loading.classList.add('hidden');

        if (data.icons && data.icons.length > 0) {
            renderIcons(data.icons);
        } else {
            noResults.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Lỗi khi tìm kiếm icon:', error);
        loading.classList.add('hidden');
        alert('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.');
    }
}

function renderIcons(icons) {
    icons.forEach(iconName => {
        // iconName is like "mdi:home"
        const svgUrl = `https://api.iconify.design/${iconName}.svg`;

        const item = document.createElement('div');
        item.className = 'svg-item';

        item.innerHTML = `
            <div class="svg-preview">
                <img src="${svgUrl}" alt="${iconName}">
            </div>
            <div class="svg-name">${iconName}</div>
            <button class="copy-btn" onclick="copyUrl('${svgUrl}', this)">Sao chép URL</button>
        `;

        resultsGrid.appendChild(item);
    });
}

function copyUrl(url, button) {
    navigator.clipboard.writeText(url).then(() => {
        const originalText = button.innerText;
        button.innerText = 'Đã sao chép!';
        button.classList.add('copied');

        setTimeout(() => {
            button.innerText = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Không thể sao chép URL: ', err);
        alert('Không thể sao chép URL vào clipboard.');
    });
}
