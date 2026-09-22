/**
 * SANGI Landing Page -- Image Optimizer
 * Converts PNG/JPG -> WebP and re-compresses originals using sharp.
 * Run:  node optimize-images.js
 */

const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

const WEBP_QUALITY = 82;
const JPEG_QUALITY = 85;

const RESIZE_CONFIG = {
  hero_home_services:   { width: 1280, height: 854  },
  join_pro_banner:      { width: 1280, height: 720  },
  trust_guarantee:      { width: 900,  height: 600  },
  app_mockup_phone:     { width: 600,  height: 900  },
  download_app_icon:    { width: 800,  height: 600  },
  splash:               { width: 480,  height: 854  },
  customer_role:        { width: 480,  height: 854  },
  staff_role:           { width: 480,  height: 854  },
  login_header:         { width: 800,  height: 400  },
  login_ui:             { width: 480,  height: 854  },
  logo:                 { width: 400,  height: 400  },
};

const SERVICE_RESIZE = { width: 600, height: 450 };

async function optimizeImage(srcPath, resize) {
  const dir      = path.dirname(srcPath);
  const baseName = path.basename(srcPath, path.extname(srcPath));
  const ext      = path.extname(srcPath).toLowerCase();
  const webpDest = path.join(dir, baseName + '.webp');
  const tmpDest  = path.join(dir, baseName + '__tmp' + ext);
  const origSize = fs.statSync(srcPath).size;

  try {
    let pl = sharp(srcPath);
    if (resize) {
      pl = pl.resize(resize.width, resize.height, { fit: 'inside', withoutEnlargement: true });
    }

    // Write WebP version
    await pl.clone().webp({ quality: WEBP_QUALITY }).toFile(webpDest);
    const webpSize = fs.statSync(webpDest).size;

    // Re-compress original to a temp file, then replace
    if (ext === '.jpg' || ext === '.jpeg') {
      await pl.clone().jpeg({ quality: JPEG_QUALITY, progressive: true }).toFile(tmpDest);
    } else if (ext === '.png') {
      await pl.clone().png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(tmpDest);
    }
    fs.renameSync(tmpDest, srcPath);

    const newOrigSize = fs.statSync(srcPath).size;
    const saved = (((origSize - webpSize) / origSize) * 100).toFixed(1);
    console.log(
      '  OK ' + baseName.padEnd(28) +
      (origSize    / 1024).toFixed(0).toString().padStart(6) + ' KB  ->  WebP ' +
      (webpSize    / 1024).toFixed(0).toString().padStart(5) + ' KB  (' + saved + '% lighter)  |  orig re-compressed: ' +
      (newOrigSize / 1024).toFixed(0) + ' KB'
    );
  } catch (err) {
    // cleanup temp if exists
    if (fs.existsSync(tmpDest)) fs.unlinkSync(tmpDest);
    console.error('  FAIL ' + srcPath + ' -- ' + err.message);
  }
}

async function processDirectory(dir, resize) {
  const files = fs.readdirSync(dir).filter(function(f) {
    return /\.(png|jpg|jpeg)$/i.test(f) && !f.includes('__tmp');
  });
  for (const file of files) {
    const baseName   = path.basename(file, path.extname(file));
    const fileResize = resize || RESIZE_CONFIG[baseName] || null;
    await optimizeImage(path.join(dir, file), fileResize);
  }
}

(async () => {
  console.log('\nSANGI Image Optimizer (sharp)\n' + '='.repeat(70));
  const baseDir    = path.join(__dirname, 'assets', 'images');
  const serviceDir = path.join(__dirname, 'assets', 'images', 'services');

  console.log('\nRoot images:');
  await processDirectory(baseDir, null);

  console.log('\nService images:');
  await processDirectory(serviceDir, SERVICE_RESIZE);

  console.log('\nDone! WebP files generated alongside originals.');
  console.log('Update your HTML to use <picture> tags for best results.');
})();
