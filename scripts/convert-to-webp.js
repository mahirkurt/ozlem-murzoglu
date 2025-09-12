const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../public/images');
const outputDir = path.join(__dirname, '../public/images/webp');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get all image files
const imageFiles = fs.readdirSync(inputDir).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png'].includes(ext);
});

console.log(`Found ${imageFiles.length} images to convert`);

// Convert each image to WebP
imageFiles.forEach(async (file) => {
  const inputPath = path.join(inputDir, file);
  const outputFileName = path.basename(file, path.extname(file)) + '.webp';
  const outputPath = path.join(outputDir, outputFileName);
  
  try {
    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPath);
    
    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(2);
    
    console.log(`✓ ${file} → ${outputFileName} (${savings}% smaller)`);
  } catch (error) {
    console.error(`✗ Error converting ${file}:`, error.message);
  }
});

console.log('\nWebP conversion complete!');
console.log('Update your image references to use the WebP versions.');