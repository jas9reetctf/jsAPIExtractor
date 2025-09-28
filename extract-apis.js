const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const { detectFramework } = require("./frameworkDetector");
const expressAnalyzer = require("./analyzers/express");
const nestAnalyzer = require("./analyzers/nestjs");
const { findEndpointsForNext } = require("./analyzers/nextjs");

// --- clear cache so latest analyzers are loaded ---
function clearProjectRequireCache(dir) {
  Object.keys(require.cache).forEach((k) => {
    if (k.startsWith(dir)) delete require.cache[k];
  });
}
clearProjectRequireCache(path.join(__dirname, "analyzers"));

// Walk project directory
function walkDir(dir, filelist = []) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, filelist);
    } else if (/\.(js|ts|tsx)$/.test(file)) {
      filelist.push(fullPath);
    }
  });
  return filelist;
}

function analyzeFile(filepath, projectRoot) {
  const code = fs.readFileSync(filepath, "utf8");
  const framework = detectFramework(code, filepath);
  if (!framework) return [];

  if (framework === "nextjs") {
    return findEndpointsForNext(filepath, projectRoot);
  }

  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: "unambiguous",
      plugins: ["jsx", "typescript", "classProperties", "decorators-legacy"],
    });
  } catch {
    return [];
  }

  if (framework === "express") {
    return expressAnalyzer.findEndpoints(ast, filepath);
  }
  if (framework === "nestjs") {
    return nestAnalyzer.findEndpoints(ast, filepath);
  }
  return [];
}

// ---- CLI Entrypoint ----
const targetDir = process.argv[2];
if (!targetDir) {
  console.error("Usage: node extract-apis.js <project-path>");
  process.exit(1);
}

const files = walkDir(targetDir);
let allEndpoints = [];
files.forEach((f) => {
  allEndpoints = allEndpoints.concat(analyzeFile(f, targetDir));
});

// Print JSON summary
console.log(JSON.stringify(allEndpoints, null, 2));
console.log(`\nTotal APIs found: ${allEndpoints.length}`);

// --- Save as CSV automatically ---
const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const projectName = path.basename(path.resolve(targetDir));
const csvFile = path.join(outputDir, `${projectName}.csv`);

const header = "framework,method,path,file\n";
const rows = allEndpoints.map(
  (ep) => `${ep.framework},${ep.method},"${ep.path}","${ep.file}"`
);
fs.writeFileSync(csvFile, header + rows.join("\n"), "utf8");

console.log(`\n Results saved to ${csvFile}`);
