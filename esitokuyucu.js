let pages = [];
let currentPage = 0;

const currentPageInfo = document.getElementById('currentPageInfo');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageSelect = document.getElementById('pageSelect');
const pageContent = document.getElementById('pageContent');
const contentText = document.getElementById('contentText');


async function loadTextFromFile() { // dosyadan yükle
    try {
        const contentArea = document.getElementById('contentText');
        if (contentArea) {
            contentArea.innerHTML = '<div>Dosya yükleniyor...</div>';
        }
        
        // Fetch ile metin.md
        const response = await fetch('metin.md?' + new Date().getTime());
        if (!response.ok) {
            throw new Error(`Dosya bulunamadı: ${response.status} - ${response.statusText}`);
        }
        
        const text = await response.text();
        const headers = response.headers;
        
        initializePagesFromText(text);
        
    } catch (error) {
        console.error('Dosya yükleme hatası:', error);
        const sampleText = `Dosya yüklenemedi metin.md dosyası bulunamadı veya okunamadı.
Hata: ${error.message}`;
        initializePagesFromText(sampleText);
    }
}

function initializePagesFromText(text) {
    pages = text.split('=').map(page => page.trim()).filter(page => page.length > 0);
    
    if (pageSelect) {
        pageSelect.innerHTML = '<option value="">Sayfaya git...</option>';
        for (let i = 0; i < pages.length; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Sayfa ${i + 1}`;
            pageSelect.appendChild(option);
        }
    }
    
    currentPage = 0;
    displayPage();
}

function displayPage() {
    if (pages.length === 0) return;

    if (currentPageInfo) {
        currentPageInfo.textContent = `Sayfa ${currentPage + 1} / ${pages.length}`;
    }

    if (prevBtn) {
        prevBtn.disabled = currentPage === 0;
    }
    if (nextBtn) {
        nextBtn.disabled = currentPage === pages.length - 1;
    }

    // Sayfa içeriğini göster
    const pageText = pages[currentPage];
    if (contentText) {
        contentText.textContent = pageText;
    }

    // Fade-in animasyonu ekle
    if (pageContent) {
        pageContent.classList.remove('fade-in');
        setTimeout(() => {
            pageContent.classList.add('fade-in');
        }, 50);
    }

    // Page selector'ı güncelle
    if (pageSelect) {
        pageSelect.value = currentPage;
    }
}

// Önceki sayfa
function previousPage() {
    if (currentPage > 0) {
        currentPage--;
        displayPage();
    }
}

// Sonraki sayfa
function nextPage() {
    if (currentPage < pages.length - 1) {
        currentPage++;
        displayPage();
    }
}

// Belirli bir sayfaya atla
function jumpToPage() {
    const selectedPage = parseInt(pageSelect.value);
    if (!isNaN(selectedPage) && selectedPage >= 0 && selectedPage < pages.length) {
        currentPage = selectedPage;
        displayPage();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (prevBtn) prevBtn.addEventListener('click', previousPage);
    if (nextBtn) nextBtn.addEventListener('click', nextPage);
    if (pageSelect) pageSelect.addEventListener('change', jumpToPage);
    
    // Klavye navigasyonu
    document.addEventListener('keydown', function(e) {
        if (pages.length === 0) return;
        
        if (e.key === 'ArrowLeft' && currentPage > 0) {
            previousPage();
        } else if (e.key === 'ArrowRight' && currentPage < pages.length - 1) {
            nextPage();
        }
    });
    
    loadTextFromFile();
});