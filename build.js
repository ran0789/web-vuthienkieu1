const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'content/posts');
const outputDir = path.join(__dirname, 'posts');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdir(postsDir, (err, files) => {
  if (err) return console.error('Lỗi đọc thư mục posts:', err);

  files.forEach(file => {
    if (file.endsWith('.md')) {
      const filePath = path.join(postsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');

      const titleMatch = content.match(/title:\s*"(.*?)"/) || content.match(/title:\s*(.*)/);
      const authorMatch = content.match(/author:\s*"(.*?)"/) || content.match(/author:\s*(.*)/);
      const imageMatch = content.match(/featured_image:\s*"(.*?)"/) || content.match(/featured_image:\s*(.*)/);
      const dateMatch = content.match(/created_date:\s*"(.*?)"/) || content.match(/created_date:\s*(.*)/);

      // Cắt lấy phần nội dung chính sau Frontmatter
      const parts = content.split('---');
      // Giữ nguyên văn bản gốc, chỉ dùng trim() để làm sạch khoảng trắng thừa đầu/cuối
      const formattedBody = parts.length > 2 ? parts.slice(2).join('---').trim() : '';

      const title = titleMatch ? titleMatch[1].replace(/"/g, '').trim() : 'Tác phẩm';
      const author = authorMatch ? authorMatch[1].replace(/"/g, '').trim() : 'Vũ Thiên Kiều';
      
      // Xử lý và làm sạch dữ liệu Ngày sáng tác
      let rawDate = dateMatch ? dateMatch[1].replace(/"/g, '').replace(/'/g, '').trim() : '';

      // Xử lý và làm sạch đường dẫn Ảnh đại diện
      let image = imageMatch ? imageMatch[1].replace(/"/g, '').replace(/'/g, '').trim() : '';
      let hasImage = false;

      if (image && image.length > 0) {
        hasImage = true;
        // Tự động tối ưu đường dẫn ảnh tuyệt đối cho Facebook/Zalo
        if (!image.startsWith('http')) {
          image = 'https://vuthienkieu.vn' + (image.startsWith('/') ? '' : '/') + image;
        }
      }

      const slug = file.replace('.md', '');
      const postUrl = `https://vuthienkieu.vn/posts/${slug}.html`;
      const description = formattedBody.replace(/[\r\n]+/g, ' ').substring(0, 150).replace(/"/g, "'");

      const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Vũ Thiên Kiều</title>
  
  <!-- Thẻ Meta Open Graph hiển thị chuẩn Facebook, Zalo -->
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${postUrl}" />
  <meta property="og:title" content="${title} - Vũ Thiên Kiều" />
  <meta property="og:description" content="${description}" />
  ${hasImage ? `<meta property="og:image" content="${image}" />` : ''}
  ${hasImage ? `<meta property="og:image:secure_url" content="${image}" />` : ''}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title} - Vũ Thiên Kiều" />
  <meta name="twitter:description" content="${description}" />
  ${hasImage ? `<meta name="twitter:image" content="${image}" />` : ''}

  <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Montserrat', sans-serif; background: #fdfbf7; color: #2c3e50; line-height: 1.8; margin: 0; padding: 2rem 1rem; }
    .container { max-width: 800px; margin: 0 auto; background: #fff; padding: 2.5rem; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
    h1 { font-family: 'Merriweather', serif; color: #2d5a27; margin-bottom: 0.5rem; font-size: 2rem; }
    .meta { font-style: italic; color: #718096; margin-bottom: 1.5rem; font-size: 0.9rem; }
    
    /* Cấu hình hiển thị thơ: giữ đúng tuyệt đối khoảng cách khổ thơ và xuống dòng */
    .post-body { 
      font-size: 1.1rem; 
      line-height: 1.9; 
      color: #2c3e50; 
      margin-top: 1.5rem; 
      white-space: pre-wrap; /* Tự động nhận diện dòng trống và xuống dòng từ Markdown */
      word-break: keep-all;
      overflow-wrap: normal;
    }
    
    .post-img { max-width: 100%; height: auto; border-radius: 8px; margin: 1.5rem 0; display: block; }
    .share-box { margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px dashed #e2e8f0; display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: center; }
    .btn { border: none; padding: 0.5rem 1rem; border-radius: 6px; color: #fff; font-weight: 600; cursor: pointer; text-decoration: none; font-size: 0.85rem; }
    .btn-fb { background: #1877f2; }
    .btn-zalo { background: #0068ff; }
    .btn-back { background: #4a5568; display: inline-block; margin-bottom: 1.5rem; }

    /* Điều chỉnh riêng cho màn hình điện thoại */
    @media (max-width: 768px) {
      body { padding: 1rem 0.5rem; }
      .container { padding: 1.2rem 0.8rem; }
      h1 { font-size: 1.5rem; }
      .post-body {
        font-size: clamp(0.78rem, 3.8vw, 0.95rem);
        letter-spacing: -0.2px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <a href="/" class="btn btn-back">← Trở về trang chủ</a>
    <h1>${title}</h1>
    <div class="meta">Tác giả: ${author} ${rawDate ? '| Sáng tác: ' + rawDate : ''}</div>
    ${hasImage ? `<img src="${image}" class="post-img" onerror="this.style.display='none'" />` : ''}
    
    <!-- Hiển thị trực tiếp formattedBody -->
    <div class="post-body">${formattedBody}</div>
    
    <div class="share-box">
      <span style="width:100%; font-weight:bold; margin-bottom: 0.3rem;">Chia sẻ tác phẩm:</span>
      <button class="btn btn-fb" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), '_blank')">Facebook</button>
      <button class="btn btn-zalo" onclick="window.open('https://zalo.me/share?url=' + encodeURIComponent(window.location.href), '_blank')">Zalo</button>
      <button class="btn" style="background:#2d5a27" onclick="navigator.clipboard.writeText(window.location.href); alert('Đã chép liên kết!');">Chép Link</button>
    </div>
  </div>
</body>
</html>`;

      fs.writeFileSync(path.join(outputDir, `${slug}.html`), htmlContent);
    }
  });
});
