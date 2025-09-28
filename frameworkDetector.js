function detectFramework(code, filePath) {
  // Express detection
  if (/require\(['"]express['"]\)/.test(code) || /from ['"]express['"]/.test(code)) {
    return "express";
  }

  // NestJS detection
  if (/from ['"]@nestjs\/common['"]/.test(code) || /@Controller/.test(code)) {
    return "nestjs";
  }

  // Next.js detection based on file structure
  if (/pages\/api\//.test(filePath) || /app\/api\//.test(filePath)) {
    return "nextjs";
  }

  return null;
}

module.exports = { detectFramework };
