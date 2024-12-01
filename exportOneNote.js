const getExtension = (src) => {
  const header = src.substring(0, 100);
  
  if (header.includes('data:image/jpeg')) return 'jpg';
  if (header.includes('data:image/png')) return 'png';
  if (header.includes('data:image/webp')) return 'webp';
  return '';
};

const download = (fileName, href) => {
  const link = document.createElement('a');
  link.href = href;
  link.download = fileName
  link.click();
};

const main = () => {
  const elements = document.querySelectorAll('p,img');
  let imageIndex = 0;
  let body = '';
  for(const element of elements) {
    if (element.tagName === 'P') {
      const text = element.textContent.trim();
      if (text) {
        body += text + '  \n';
      }
    } else if (element.tagName === 'IMG') {
      if (element.width > 600) {
        const h = Math.floor(800  * element.height / element.width);
        const ext = getExtension(element.src);
        const baseName = `image-${String(imageIndex).padStart(2, '0')}`;
        const fileName = `${baseName}.${ext}`;
        const convertedFileName = `${baseName}_800x${h}.webp`;
        download(fileName, element.src);
        body += `![${convertedFileName}](${convertedFileName})  \n`;
        imageIndex += 1;
      }
    }
  }
  console.log(body);
}
main();
