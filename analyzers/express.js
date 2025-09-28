const traverse = require("@babel/traverse").default;

const HTTP_METHODS = new Set([
  "get","post","put","delete","patch","options","head","all"
]);

function findEndpoints(ast, filename) {
  const endpoints = [];

  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;
      if (!callee || callee.type !== "MemberExpression") return;

      const method = callee.property.name;
      if (!HTTP_METHODS.has(method?.toLowerCase())) return;

      const args = path.node.arguments || [];
      if (!args.length) return;

      const first = args[0];
      if (first.type === "StringLiteral") {
        endpoints.push({
          framework: "express",
          method: method.toUpperCase(),
          path: first.value,
          file: filename
        });
      }
    }
  });

  return endpoints;
}

module.exports = { findEndpoints };
