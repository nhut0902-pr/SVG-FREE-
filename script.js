// --- SVG Finder Logic ---
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
    }
}

function renderIcons(icons) {
    icons.forEach(iconName => {
        const svgUrl = `https://api.iconify.design/${iconName}.svg`;
        const item = document.createElement('div');
        item.className = 'svg-item';
        item.innerHTML = `
            <div class="svg-preview"><img src="${svgUrl}" alt="${iconName}"></div>
            <div class="svg-name">${iconName}</div>
            <button class="copy-btn" onclick="copyToClipboard('${svgUrl}', this)">Sao chép URL</button>
        `;
        resultsGrid.appendChild(item);
    });
}

// --- Tab Logic ---
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.add('hidden'));

        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.remove('hidden');

        if (btn.dataset.tab === 'code-tab') {
            renderSnippets('all');
        }
    });
});

// --- Snippet Data & Logic ---
const snippets = [
    {
        id: 1,
        title: 'Spinning Loader',
        category: 'loading',
        html: '<div class="loader"></div>',
        css: `.loader {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`
    },
    {
        id: 2,
        title: 'Dots Loading',
        category: 'loading',
        html: '<div class="dots-loader"><div></div><div></div><div></div></div>',
        css: `.dots-loader {
  display: flex;
  justify-content: center;
  gap: 5px;
}
.dots-loader div {
  width: 15px;
  height: 15px;
  background-color: #3498db;
  border-radius: 50%;
  animation: bounce 0.6s infinite alternate;
}
.dots-loader div:nth-child(2) { animation-delay: 0.2s; }
.dots-loader div:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce {
  to { transform: translateY(-15px); }
}`
    },
    {
        id: 3,
        title: 'Simple 404 Layout',
        category: '404',
        html: '<div class="error-container">\n  <h1>404</h1>\n  <p>Trang không tìm thấy</p>\n  <a href="#">Quay lại trang chủ</a>\n</div>',
        css: `.error-container {
  text-align: center;
  font-family: sans-serif;
}
.error-container h1 {
  font-size: 80px;
  margin: 0;
  color: #e74c3c;
}
.error-container p {
  font-size: 20px;
  color: #7f8c8d;
}`
    },
    {
        id: 4,
        title: 'Neon Button',
        category: 'button',
        html: '<button class="neon-btn">Hover Me</button>',
        css: `.neon-btn {
  padding: 15px 30px;
  background: transparent;
  color: #03e9f4;
  border: 1px solid #03e9f4;
  font-size: 18px;
  cursor: pointer;
  transition: 0.5s;
  position: relative;
  overflow: hidden;
}
.neon-btn:hover {
  background: #03e9f4;
  color: #fff;
  box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4;
}`
    }
];

const snippetsGrid = document.getElementById('snippetsGrid');
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderSnippets(btn.dataset.filter);
    });
});

function renderSnippets(filter) {
    snippetsGrid.innerHTML = '';
    const filtered = filter === 'all' ? snippets : snippets.filter(s => s.category === filter);

    filtered.forEach(s => {
        const item = document.createElement('div');
        item.className = 'svg-item';
        item.innerHTML = `
            <div class="svg-preview" style="font-size: 2rem;">📄</div>
            <div class="svg-name">${s.title}</div>
            <button class="copy-btn" onclick="openPreview(${s.id})">Xem & Copy</button>
        `;
        snippetsGrid.appendChild(item);
    });
}

// --- Preview Modal Logic ---
const modal = document.getElementById('previewModal');
const closeModal = document.querySelector('.close-modal');
const previewContainer = document.getElementById('previewContainer');
const htmlCode = document.getElementById('htmlCode');
const cssCode = document.getElementById('cssCode');

function openPreview(id) {
    const s = snippets.find(item => item.id === id);
    if (!s) return;

    previewContainer.innerHTML = s.html;
    // Add dynamic CSS
    let styleTag = document.getElementById('preview-style');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'preview-style';
        document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = s.css;

    htmlCode.innerText = s.html;
    cssCode.innerText = s.css;

    modal.classList.remove('hidden');
}

closeModal.onclick = () => modal.classList.add('hidden');
window.onclick = (e) => { if (e.target == modal) modal.classList.add('hidden'); };

// --- Global Clipboard Helper ---
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.innerText;
        button.innerText = 'Đã sao chép!';
        button.classList.add('copied');
        setTimeout(() => {
            button.innerText = originalText;
            button.classList.remove('copied');
        }, 2000);
    });
}

// Update copy buttons in modal
document.querySelectorAll('.copy-code-btn').forEach(btn => {
    btn.onclick = () => {
        const type = btn.dataset.type;
        const text = type === 'html' ? htmlCode.innerText : cssCode.innerText;
        copyToClipboard(text, btn);
    };
});
