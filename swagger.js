const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Note-Taking-App API",
            version: "1.0.0",
            description: "API documentation for Note-Taking-App",
            contact: {
                name: "Vicky"
            },
            servers: [
                {
                    url: "https://note-taking-app-6duw.onrender.com",
                    description: "Render Server"
                }
            ]          
        }
    },
    apis: ["./routes/*.js", "./app.js"] 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const serveSwagger = (app) => {
    app.use("/api-info", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = serveSwagger;