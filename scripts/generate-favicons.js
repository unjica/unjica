const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateFavicons() {
  const inputFile = path.join(process.cwd(), 'public', 'Unjica LOGO.jpeg');
  const outputDir = path.join(process.cwd(), 'public');

  // Create output directory if it doesn't exist
  await fs.mkdir(outputDir, { recursive: true });

  // Generate different sizes
  const sizes = {
    'favicon-16x16.png': 16,
    'favicon-32x32.png': 32,
    'apple-touch-icon.png': 180,
    'android-chrome-192x192.png': 192,
    'android-chrome-512x512.png': 512,
    'favicon.png': 32  // Using 32x32 PNG as favicon
  };

  for (const [filename, size] of Object.entries(sizes)) {
    await sharp(inputFile)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(outputDir, filename));
    
    console.log(`Generated ${filename}`);
  }
}

generateFavicons().catch(console.error); 