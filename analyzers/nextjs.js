const path = require("path");

function findEndpointsForNext(filePath, projectRoot) {
  const endpoints = [];
  const relPath = path.relative(projectRoot, filePath);

  // Pages Router
  if (relPath.startsWith("pages/api/")) {
    const route = "/" + relPath.replace(/^pages/, "").replace(/\.[jt]sx?$/, "");
    endpoints.push({
      framework: "nextjs",
      method: "ANY",
      path: route.replace(/\\/g, "/"),
      file: filePath
    });
  }

  // App Router
  if (relPath.startsWith("app/api/") && /route\.[jt]sx?$/.test(relPath)) {
    const route = "/" + relPath.replace(/^app/, "").replace(/\/route\.[jt]sx?$/, "");
    endpoints.push({
      framework: "nextjs",
      method: "ANY",
      path: route.replace(/\\/g, "/"),
      file: filePath
    });
  }

  return endpoints;
}

module.exports = { findEndpointsForNext };
