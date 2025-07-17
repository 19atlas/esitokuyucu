let pages = [];
let currentPage = 0;
const contentArea = document.getElementById('pageContent');
const messageArea = document.getElementById('messageArea');

window.onload = function () {
    loadTextFile();
};

async function loadTextFile() {
    try {
        contentArea.innerHTML = '<div>Dosya yükleniyor...</div>';

        // Fetch ile metin.txt dosyasını al
        const response = await fetch('metin.md?' + new Date().getTime());

        if (!response.ok) {
            throw new Error(`Dosya bulunamadı: ${response.status} - ${response.statusText}`);
        }

        const text = await response.text();
        const headers = response.headers;


        // İçeriği göster
        displayTextContent(text);


    } catch (error) {
        showMessage(`Hata: ${error.message}`, 'error');
        contentArea.innerHTML = `
                    <div class="empty-state">
                        <strong>Dosya yüklenemedi!</strong><br>
                        Lütfen "metin.txt" dosyasının website ile aynı klasörde olduğundan emin olun.
                    </div>
                `;
    }
}


function showMessage(message, type) {
    const className = type === 'error' ? 'error-message' : 'success-message';
    messageArea.innerHTML = `<div class="${className}">${message}</div>`;

    // 3 saniye sonra mesajı kaldır
    setTimeout(() => {
        messageArea.innerHTML = '';
    }, 3000);
}

function displayTextContent(text) {  //asıl okuyucu
    if (!text.trim()) {
        contentArea.innerHTML = '<div class="empty-state">Dosya boş görünüyor.</div>';
        return;
    }
    pages = text.split('=').map(page => page.trim()).filter(page => page.length > 0);

    // Metni paragraflara böl
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());

    if (paragraphs.length === 0) {
        // Eğer çift satır arası yoksa, tek satırları paragraf olarak işle
        const lines = text.split('\n').filter(line => line.trim());
        paragraphs.push(...lines);
    }

    // Her paragrafı <p> etiketine ekle
    let htmlContent = '';
    paragraphs.forEach(paragraph => {
        const cleanParagraph = paragraph.trim().replace(/\n/g, '<br>');
        if (cleanParagraph) {
            htmlContent += `<p>${cleanParagraph}</p>`;
        }
    });

    contentArea.innerHTML = htmlContent;
}
