const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'content/posts');
const outputDir = path.join(__dirname, 'posts');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(postsDir).forEach(file => {
  if (!file.endsWith('.md')) return;

  const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
  
  // Trích xuất thông tin
  const titleMatch = content.match(/title:\s*"(.*?)"/) || content.match(/title:\s*(.*)/);
  const authorMatch = content.match(/author:\s*"(.*?)"/) || content.match(/author:\s*(.*)/);
  const imageMatch = content.match(/featured_image:\s*"(.*?)"/) || content.match(/featured_image:\s*(.*)/);
  const dateMatch = content.match(/created_date:\s*"(.*?)"/) || content.match(/created_date:\s*(.*)/);

  const parts = content.split('---');
  const body = parts.length > 2 ? parts.slice(2).join('---').trim() : '';

  const title = titleMatch ? titleMatch[1].trim() : 'Tác phẩm';
  const author = authorMatch ? authorMatch[1].trim() : 'Vũ Thiên Kiều';
  const image = imageMatch ? imageMatch[1].trim() : 'https://vuthienkieu.vn/images/uploads/anh-bia-share.jpg';
  const date = dateMatch ? dateMatch[1].trim() : '';

  // Lấy 3 câu đầu tiên làm đoạn xem trước khi Share
  const description = body.split('\n').filter(line => line.trim() !== '').slice(0, 3).join(' ').replace(/"/g, "'");
  
  const slug = file.replace('.md', '');
  const fullImageUrl = image.startsWith('http') ? image : `https://vuthienkieu.vn/${image.replace(/^\//, '')}`;

  const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ${author}</title>

  <!-- Open Graph Share -->
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://vuthienkieu.vn/posts/${slug}.html" />
  <meta property="og:title" content="${title} - ${author}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${fullImageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Montserrat', sans-serif; background: #fdfbf7; color: #2c3e50; line-height: 1.8; padding: 2rem 1rem; }
    .container { max-width: 750px; margin: 0 auto; background: #fff; padding: 2.5rem; border-radius: 12px; border: 1px solid #e2e8f0; }
    h1 { font-family: 'Merriweather', serif; color: #2d5a27; margin-bottom: 0.5rem; }
    .meta { font-style: italic; color: #718096; margin-bottom: 1.5rem; font-size: 0.9rem; }
    .content { white-space: pre-wrap; font-size: 1.1rem; }
    .back-btn { display: inline-block; margin-bottom: 1.5rem; text-decoration: none; color: #2d5a27; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <a href="/" class="back-btn">← Quay lại trang chủ</a>
    <h1>${title}</h1>
    <div class="meta">Tác giả: ${author}${date ? ' | Sáng tác: ' + date : ''}</div>
    ${image ? `<img src="${fullImageUrl}" style="max-width:100%; border-radius:8px; margin-bottom:1.5rem;">` : ''}
    <div class="content">${body}</div>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, `${slug}.html`), htmlContent, 'utf-8');
});

console.log('Đã biên dịch xong toàn bộ file HTML chi tiết!');
