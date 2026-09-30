const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "🚀 AWS EC2 Backend Testing API",
      version: "1.0.0",
      description: `
## Welcome to the EC2 Backend Testing Playground!

This API is built with **Express.js** and hosted on **AWS EC2** for learning backend deployment.

### 📦 Available Resources
| Resource | Endpoints | Methods |
|----------|-----------|---------|
| **Users**    | \`/api/users\`    | GET, POST, PUT, PATCH, DELETE |
| **Products** | \`/api/products\` | GET, POST, PUT, PATCH, DELETE |
| **Orders**   | \`/api/orders\`   | GET, POST, PUT, PATCH, DELETE |
| **Posts**    | \`/api/posts\`    | GET, POST, PUT, PATCH, DELETE |

### 🗄️ Data Storage
All data is stored **in-memory** (no database). Data resets when the server restarts.

### 💡 HTTP Methods Explained
- **GET** — Retrieve data
- **POST** — Create new resource
- **PUT** — Fully replace a resource
- **PATCH** — Partially update a resource
- **DELETE** — Remove a resource
      `,
      contact: {
        name: "AWS EC2 Backend Testing",
        url: "https://github.com/Saini-Yogesh/AWS-EC2-Backend-Testing",
      },
      license: {
        name: "ISC",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "🖥️  Local Development Server",
      },
      {
        url: "http://{ec2-public-ip}:3000",
        description: "☁️  AWS EC2 Production Server",
        variables: {
          "ec2-public-ip": {
            default: "YOUR_EC2_PUBLIC_IP",
            description: "Replace with your EC2 instance public IP address",
          },
        },
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id:        { type: "integer",  example: 1 },
            name:      { type: "string",   example: "Alice Johnson" },
            email:     { type: "string",   example: "alice@example.com" },
            role:      { type: "string",   enum: ["admin", "user", "mod"], example: "admin" },
            age:       { type: "integer",  example: 28 },
            active:    { type: "boolean",  example: true },
            createdAt: { type: "string",   format: "date-time" },
            updatedAt: { type: "string",   format: "date-time" },
          },
        },
        Product: {
          type: "object",
          properties: {
            id:       { type: "integer", example: 1 },
            name:     { type: "string",  example: "Laptop Pro X" },
            price:    { type: "number",  example: 1299.99 },
            category: { type: "string",  example: "Electronics" },
            stock:    { type: "integer", example: 50 },
            rating:   { type: "number",  example: 4.8 },
            inStock:  { type: "boolean", example: true },
          },
        },
        Order: {
          type: "object",
          properties: {
            id:         { type: "integer", example: 1 },
            userId:     { type: "integer", example: 1 },
            productId:  { type: "integer", example: 2 },
            quantity:   { type: "integer", example: 2 },
            status:     { type: "string",  enum: ["pending", "processing", "shipped", "delivered", "cancelled"], example: "delivered" },
            totalPrice: { type: "number",  example: 399.98 },
            orderedAt:  { type: "string",  format: "date-time" },
          },
        },
        Post: {
          type: "object",
          properties: {
            id:        { type: "integer", example: 1 },
            userId:    { type: "integer", example: 1 },
            title:     { type: "string",  example: "Getting Started with AWS EC2" },
            body:      { type: "string",  example: "AWS EC2 is a web service..." },
            tags:      { type: "array",   items: { type: "string" }, example: ["aws", "cloud"] },
            likes:     { type: "integer", example: 42 },
            createdAt: { type: "string",  format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string",  example: "Resource not found" },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string",  example: "Operation successful" },
            data:    { type: "object" },
          },
        },
      },
    },
    tags: [
      { name: "Health",   description: "Server health and status checks" },
      { name: "Users",    description: "User management — GET, POST, PUT, PATCH, DELETE" },
      { name: "Products", description: "Product catalog — GET, POST, PUT, PATCH, DELETE" },
      { name: "Orders",   description: "Order management — GET, POST, PUT, PATCH, DELETE" },
      { name: "Posts",    description: "Blog posts — GET, POST, PUT, PATCH, DELETE" },
    ],
  },
  apis: ["./src/routes/*.js", "./server.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
