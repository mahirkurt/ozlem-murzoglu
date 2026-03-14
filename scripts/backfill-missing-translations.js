#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const translationFiles = {
  tr: path.join(__dirname, '../src/assets/i18n/tr.json'),
  en: path.join(__dirname, '../src/assets/i18n/en.json')
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function syncMissingKeys(source, target) {
  let changes = 0;

  Object.entries(source).forEach(([key, value]) => {
    if (!(key in target)) {
      target[key] = clone(value);
      changes += 1;
      return;
    }

    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      changes += syncMissingKeys(value, target[key]);
    }
  });

  return changes;
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function main() {
  const tr = readJson(translationFiles.tr);
  const en = readJson(translationFiles.en);

  const addedToEn = syncMissingKeys(tr, en);
  const addedToTr = syncMissingKeys(en, tr);

  writeJson(translationFiles.tr, tr);
  writeJson(translationFiles.en, en);

  console.log(`Added ${addedToEn} missing top-level/nested entries to en.json`);
  console.log(`Added ${addedToTr} missing top-level/nested entries to tr.json`);
}

main();
