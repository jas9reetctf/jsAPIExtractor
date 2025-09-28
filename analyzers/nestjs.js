const traverse = require("@babel/traverse").default;

function findEndpoints(ast, filename) {
  const endpoints = [];

  traverse(ast, {
    ClassDeclaration(path) {
      const decorators = path.node.decorators || [];
      let basePath = "";

      decorators.forEach((dec) => {
        if (dec.expression.callee?.name === "Controller") {
          const args = dec.expression.arguments || [];
          if (args.length && args[0].type === "StringLiteral") {
            basePath = args[0].value;
          }
        }
      });

      path.traverse({
        ClassMethod(methodPath) {
          const methodDecorators = methodPath.node.decorators || [];
          methodDecorators.forEach((dec) => {
            const name = dec.expression.callee?.name;
            if (["Get","Post","Put","Delete","Patch"].includes(name)) {
              const args = dec.expression.arguments || [];
              let subPath = "";
              if (args.length && args[0].type === "StringLiteral") {
                subPath = args[0].value;
              }
              endpoints.push({
                framework: "nestjs",
                method: name.toUpperCase(),
                path: (basePath + subPath) || "/",
                file: filename
              });
            }
          });
        }
      });
    }
  });

  return endpoints;
}

module.exports = { findEndpoints };
