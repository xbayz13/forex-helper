/**
 * API Documentation Routes
 * Serves OpenAPI/Swagger documentation
 */

import { readFileSync } from "fs";
import { join } from "path";

const swaggerUiHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Forex Trading Helper API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
      margin:0;
      background: #fafafa;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: "/api/docs/openapi.yaml",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>
`;

export function createDocsRoutes() {
  return {
    "/api/docs": {
      GET: () => {
        return new Response(swaggerUiHtml, {
          headers: {
            "Content-Type": "text/html",
          },
        });
      },
    },
    "/api/docs/openapi.yaml": {
      GET: () => {
        try {
          const openApiPath = join(process.cwd(), "docs", "api", "openapi.yaml");
          const openApiContent = readFileSync(openApiPath, "utf-8");
          
          return new Response(openApiContent, {
            headers: {
              "Content-Type": "application/yaml",
            },
          });
        } catch (error) {
          return new Response(
            JSON.stringify({
              error: {
                message: "Failed to load API documentation",
                code: "DOCS_ERROR",
              },
            }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      },
    },
    "/api/docs/json": {
      GET: async () => {
        try {
          const openApiPath = join(process.cwd(), "docs", "api", "openapi.yaml");
          const openApiContent = readFileSync(openApiPath, "utf-8");
          
          // Convert YAML to JSON
          const yaml = await import("yaml");
          const json = yaml.parse(openApiContent);
          
          return new Response(JSON.stringify(json, null, 2), {
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          return new Response(
            JSON.stringify({
              error: {
                message: "Failed to load API documentation",
                code: "DOCS_ERROR",
              },
            }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      },
    },
  };
}

