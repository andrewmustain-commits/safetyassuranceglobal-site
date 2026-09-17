import fs from 'node:fs';
import path from 'node:path';

const dist = path.join(process.cwd(), 'dist');

if (!fs.existsSync(dist)) {
  console.error('Full-name enforcement failed: dist/ does not exist.');
  process.exit(1);
}

const protectedBrandNames = [
  'SAG Command',
  'SAG Academy',
  'SAG SECURE'
];

const htmlFiles = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(fullPath);
  }
};
walk(dist);

const protectBrands = (value) => {
  let output = value;
  const tokens = [];
  protectedBrandNames.forEach((brand, index) => {
    const token = `__SAFETY_ASSURANCE_GLOBAL_PROTECTED_BRAND_${index}__`;
    if (output.includes(brand)) {
      output = output.split(brand).join(token);
      tokens.push([token, brand]);
    }
  });
  return { output, tokens };
};

const restoreBrands = (value, tokens) => {
  let output = value;
  for (const [token, brand] of tokens) output = output.split(token).join(brand);
  return output;
};

const expandCompanyName = (value) => {
  const { output: protectedValue, tokens } = protectBrands(value);
  const expanded = protectedValue.replace(/\bSAG\b/g, 'Safety Assurance Global');
  return restoreBrands(expanded, tokens);
};

const protectBlocks = (html) => {
  const blocks = [];
  const output = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, (block) => {
    const token = `__SAFETY_ASSURANCE_GLOBAL_BLOCK_${blocks.length}__`;
    blocks.push([token, block]);
    return token;
  });
  return { output, blocks };
};

const restoreBlocks = (html, blocks) => {
  let output = html;
  for (const [token, block] of blocks) output = output.split(token).join(block);
  return output;
};

let changedFiles = 0;
const failures = [];

for (const filePath of htmlFiles) {
  const original = fs.readFileSync(filePath, 'utf8');
  const { output: withoutBlocks, blocks } = protectBlocks(original);
  const rewrittenOutsideBlocks = expandCompanyName(withoutBlocks);
  const rewritten = restoreBlocks(rewrittenOutsideBlocks, blocks);

  if (rewritten !== original) {
    fs.writeFileSync(filePath, rewritten);
    changedFiles += 1;
  }

  const { output: rewrittenWithoutBlocks } = protectBlocks(rewritten);
  const { output: protectedPublicHtml } = protectBrands(rewrittenWithoutBlocks);
  if (/\bSAG\b/.test(protectedPublicHtml)) {
    failures.push(`${path.relative(dist, filePath)}: public company abbreviation remains outside protected product names`);
  }
}

if (failures.length) {
  console.error('Full-name enforcement failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Full-name enforcement passed for ${htmlFiles.length} generated HTML pages; ${changedFiles} page(s) were normalized to “Safety Assurance Global”. Formal protected product names remain unchanged.`);
