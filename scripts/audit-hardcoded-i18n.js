#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const parse5 = require('parse5');
const ts = require('typescript');
const glob = require('glob');

const ROOT = process.cwd();
const APP_GLOB = 'src/app/**/*.{html,ts}';
const TRANSLATION_KEY_RE = /^[A-Z_]+(?:\.[A-Z_]+)+$/;
const LETTER_RE = /[A-Za-zÇĞİÖŞÜçğıöşü]/;
const ONLY_NON_TEXT_RE = /^[\d\s\-–—:/.,+*()[\]{}&;#'"!?%<>|=]+$/;
const USER_FACING_ATTRS = new Set(['aria-label', 'title', 'placeholder', 'alt']);
const TS_UI_PROPERTY_NAMES = new Set([
  'label',
  'title',
  'subtitle',
  'description',
  'excerpt',
  'content',
  'category',
  'genre',
  'author',
  'message',
  'text',
  'heading',
  'subheading',
  'summary'
]);
const TS_IGNORE_PROPERTY_NAMES = new Set([
  'id',
  'slug',
  'fileName',
  'filePath',
  'href',
  'url',
  'path',
  'route',
  'icon',
  'color',
  'type',
  'selector',
  'templateUrl',
  'styleUrl',
  'styleUrls',
  'animation',
  'animations',
  'providerIn',
  'providedIn',
  'labelKey',
  'titleKey',
  'descriptionKey',
  'translateKey',
  'hoursKey',
  'dayKey',
  'highlightKey'
]);
const TS_UI_CALLS = new Set(['alert', 'confirm', 'prompt', 'setTitle']);
const TECHNICAL_TS_FILES = [
  'src/app/core/services/design-tokens.service.ts',
  'src/app/core/services/testing.service.ts'
];

function isSkippableText(value) {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return true;
  if (!LETTER_RE.test(normalized)) return true;
  if (TRANSLATION_KEY_RE.test(normalized)) return true;
  if (ONLY_NON_TEXT_RE.test(normalized)) return true;
  if (/^[}{\s]*@(?:if|for|switch|case|else|default)\b/.test(normalized)) return true;
  if (/^[A-Z0-9+]+$/.test(normalized) && normalized.length <= 4) return true;
  if (/^(tr|en|whatsapp|google|facebook|linkedin|twitter)$/i.test(normalized)) return true;
  return false;
}

function normalizeWhitespace(value) {
  return value
    .replace(/\{\{[\s\S]*?\}\}/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getLine(text, offset) {
  return text.slice(0, offset).split('\n').length;
}

function getPropertyName(node) {
  if (!node || !ts.isPropertyAssignment(node)) return null;
  if (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) {
    return node.name.text;
  }
  return null;
}

function isLikelyUiString(value) {
  if (!value || !LETTER_RE.test(value)) return false;
  if (TRANSLATION_KEY_RE.test(value)) return false;
  if (/^(https?:|\/|\.\/|\.\.\/|data:|tel:|mailto:)/.test(value)) return false;
  if (/^[A-Z0-9_]+$/.test(value)) return false;
  if (/^[a-z0-9_-]+$/i.test(value) && value === value.toLowerCase()) return false;
  return true;
}

function collectHtmlIssues(filePath, content) {
  const doc = parse5.parseFragment(content, { sourceCodeLocationInfo: true });
  const issues = [];

  function walk(node, parent) {
    if (node.nodeName === '#text') {
      const raw = node.value || '';
      const normalized = normalizeWhitespace(raw);
      const parentClasses = new Set(
        ((parent && parent.attrs) || [])
          .filter((attr) => attr.name === 'class')
          .flatMap((attr) => attr.value.split(/\s+/))
      );
      const parentTag = parent && parent.tagName;
      const isSvgContext = parent && parent.namespaceURI === 'http://www.w3.org/2000/svg';
      const isIconText =
        parentClasses.has('material-icons') ||
        parentClasses.has('material-icons-rounded') ||
        parentTag === 'svg' ||
        parentTag === 'path' ||
        parentTag === 'text';

      if (!isSvgContext && !isIconText && !isSkippableText(normalized)) {
        issues.push({
          type: 'html-text',
          file: filePath,
          line: node.sourceCodeLocation?.startLine || 1,
          value: normalized
        });
      }
      return;
    }

    if (!node.childNodes) return;

    if (node.attrs) {
      for (const attr of node.attrs) {
        if (!USER_FACING_ATTRS.has(attr.name)) continue;
        const normalized = normalizeWhitespace(attr.value || '');
        if (isSkippableText(normalized)) continue;
        issues.push({
          type: 'html-attr',
          file: filePath,
          line: node.sourceCodeLocation?.startLine || 1,
          attr: attr.name,
          value: normalized
        });
      }
    }

    for (const child of node.childNodes) {
      walk(child, node);
    }
  }

  walk(doc, null);
  return issues;
}

function collectTsIssues(filePath, content) {
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
  const issues = [];

  function report(node, value, reason) {
    if (!isLikelyUiString(value)) return;
    const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
    issues.push({
      type: 'ts-string',
      file: filePath,
      line: line + 1,
      reason,
      value
    });
  }

  function walk(node) {
    if (ts.isStringLiteralLike(node)) {
      const value = node.text.trim();
      if (!value) {
        ts.forEachChild(node, walk);
        return;
      }

      if (ts.isImportDeclaration(node.parent) || ts.isExportDeclaration(node.parent)) {
        return;
      }

      if (ts.isPropertyAssignment(node.parent)) {
        const propertyName = getPropertyName(node.parent);
        if (propertyName && TS_IGNORE_PROPERTY_NAMES.has(propertyName)) {
          return;
        }
        if (propertyName && TS_UI_PROPERTY_NAMES.has(propertyName)) {
          report(node, value, `property:${propertyName}`);
          return;
        }
      }

      if (ts.isPropertyDeclaration(node.parent) || ts.isVariableDeclaration(node.parent)) {
        const name = node.parent.name && ts.isIdentifier(node.parent.name) ? node.parent.name.text : null;
        if (name && ['title', 'subtitle', 'description', 'message', 'label'].includes(name)) {
          report(node, value, `initializer:${name}`);
          return;
        }
      }

      if (ts.isCallExpression(node.parent)) {
        const expression = node.parent.expression;
        let callName = null;
        if (ts.isIdentifier(expression)) {
          callName = expression.text;
        } else if (ts.isPropertyAccessExpression(expression)) {
          callName = expression.name.text;
        }
        if (callName && TS_UI_CALLS.has(callName)) {
          report(node, value, `call:${callName}`);
          return;
        }
      }

      if (ts.isArrayLiteralExpression(node.parent) && ts.isPropertyAssignment(node.parent.parent)) {
        const parentPropertyName = getPropertyName(node.parent.parent);
        if (parentPropertyName === 'tags') {
          report(node, value, 'property:tags');
          return;
        }
      }
    }

    ts.forEachChild(node, walk);
  }

  walk(sourceFile);
  return issues;
}

function run() {
  const files = glob.sync(APP_GLOB, { cwd: ROOT, nodir: true }).sort();
  const issues = [];

  for (const relativeFile of files) {
    if (TECHNICAL_TS_FILES.includes(relativeFile)) {
      continue;
    }
    const absoluteFile = path.join(ROOT, relativeFile);
    const content = fs.readFileSync(absoluteFile, 'utf8');
    if (relativeFile.endsWith('.html')) {
      issues.push(...collectHtmlIssues(relativeFile, content));
    } else if (relativeFile.endsWith('.ts')) {
      issues.push(...collectTsIssues(relativeFile, content));
    }
  }

  const grouped = new Map();
  for (const issue of issues) {
    const key = issue.file;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(issue);
  }

  console.log(`Files scanned: ${files.length}`);
  console.log(`Issues found: ${issues.length}`);
  console.log('');

  for (const [file, fileIssues] of grouped.entries()) {
    console.log(file);
    for (const issue of fileIssues) {
      const extra = issue.attr ? ` ${issue.attr}` : issue.reason ? ` ${issue.reason}` : '';
      console.log(`  L${issue.line} [${issue.type}${extra}] ${issue.value}`);
    }
    console.log('');
  }

  if (issues.length > 0) {
    process.exitCode = 1;
  }
}

run();
