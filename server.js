const express        = require("express");
const cors           = require("cors");
const morgan         = require("morgan");
const swaggerUi      = require("swagger-ui-express");
const swaggerSpec    = require("./src/swagger");

// ── Route Imports ───────────────────────────────────────────
const usersRouter    = require("./src/routes/users");
const productsRouter = require("./src/routes/products");
const ordersRouter   = require("./src/routes/orders");
const postsRouter    = require("./src/routes/posts");

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ── Custom Swagger UI CSS & JS ───────────────────────────────
const swaggerUiOptions = {
  customSiteTitle: "🚀 EC2 Backend API Tester",
  customCss: `
    /* ── Base & Font ── */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

    * { box-sizing: border-box; }

    body {
      font-family: 'Inter', sans-serif !important;
      background: #0a0e1a !important;
      margin: 0;
    }

    /* ── Top Bar ── */
    .swagger-ui .topbar {
      background: linear-gradient(135deg, #0a0e1a 0%, #111827 50%, #0a0e1a 100%) !important;
      border-bottom: 1px solid rgba(99, 102, 241, 0.3) !important;
      padding: 12px 0 !important;
    }
    .swagger-ui .topbar-wrapper { padding: 0 24px !important; }
    .swagger-ui .topbar-wrapper .link {
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
      text-decoration: none !important;
    }
    .swagger-ui .topbar-wrapper .link img { display: none !important; }
    .swagger-ui .topbar-wrapper .link::before {
      content: '🚀 AWS EC2 Backend API Tester';
      font-size: 20px;
      font-weight: 700;
      color: white;
      background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* ── Main Page Background ── */
    .swagger-ui { background: #0a0e1a !important; }
    #swagger-ui { background: #0a0e1a !important; min-height: 100vh; }

    /* ── Info Section ── */
    .swagger-ui .info {
      background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.08) 50%, rgba(6,182,212,0.08) 100%) !important;
      border: 1px solid rgba(99,102,241,0.25) !important;
      border-radius: 16px !important;
      padding: 32px !important;
      margin: 24px !important;
      backdrop-filter: blur(12px) !important;
    }
    .swagger-ui .info .title {
      color: white !important;
      font-size: 28px !important;
      font-weight: 700 !important;
      background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .swagger-ui .info .description p,
    .swagger-ui .info .description li,
    .swagger-ui .info .description td,
    .swagger-ui .info .description th {
      color: #94a3b8 !important;
      font-size: 14px !important;
    }
    .swagger-ui .info .description h3 {
      color: #e2e8f0 !important;
      font-weight: 600 !important;
      margin-top: 16px !important;
    }
    .swagger-ui .info .description table {
      border-collapse: collapse !important;
      width: 100% !important;
      margin: 12px 0 !important;
    }
    .swagger-ui .info .description th {
      background: rgba(99,102,241,0.2) !important;
      color: #a5b4fc !important;
      padding: 8px 12px !important;
      text-align: left !important;
      font-weight: 600 !important;
    }
    .swagger-ui .info .description td {
      padding: 8px 12px !important;
      border-bottom: 1px solid rgba(255,255,255,0.05) !important;
    }
    .swagger-ui .info .description code {
      background: rgba(99,102,241,0.15) !important;
      color: #a5b4fc !important;
      padding: 2px 6px !important;
      border-radius: 4px !important;
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 12px !important;
    }
    .swagger-ui .info .description strong { color: #e2e8f0 !important; }

    /* ── Servers dropdown ── */
    .swagger-ui .scheme-container {
      background: #111827 !important;
      border: 1px solid rgba(99,102,241,0.2) !important;
      border-radius: 12px !important;
      padding: 16px 24px !important;
      margin: 0 24px 16px !important;
      box-shadow: 0 4px 24px rgba(0,0,0,0.3) !important;
    }
    .swagger-ui .servers > label {
      color: #94a3b8 !important;
      font-size: 13px !important;
      font-weight: 500 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.05em !important;
    }
    .swagger-ui .servers-title { color: #94a3b8 !important; }
    .swagger-ui select {
      background: #1e293b !important;
      border: 1px solid rgba(99,102,241,0.3) !important;
      border-radius: 8px !important;
      color: #e2e8f0 !important;
      padding: 8px 12px !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 14px !important;
      cursor: pointer !important;
    }

    /* ── Tag Groups (section headers) ── */
    .swagger-ui .opblock-tag {
      background: linear-gradient(135deg, rgba(17,24,39,0.9), rgba(30,41,59,0.9)) !important;
      border: 1px solid rgba(99,102,241,0.2) !important;
      border-radius: 12px !important;
      margin: 8px 24px !important;
      padding: 4px 20px !important;
      transition: all 0.3s ease !important;
    }
    .swagger-ui .opblock-tag:hover {
      border-color: rgba(99,102,241,0.5) !important;
      box-shadow: 0 0 20px rgba(99,102,241,0.1) !important;
      transform: translateY(-1px) !important;
    }
    .swagger-ui .opblock-tag a, .swagger-ui .opblock-tag span {
      color: #e2e8f0 !important;
      font-size: 17px !important;
      font-weight: 600 !important;
    }
    .swagger-ui .opblock-tag small { color: #64748b !important; font-size: 13px !important; }

    /* ── Operation Blocks ── */
    .swagger-ui .opblock {
      border-radius: 10px !important;
      margin: 6px 24px !important;
      border: 1px solid transparent !important;
      box-shadow: 0 2px 12px rgba(0,0,0,0.2) !important;
      transition: all 0.2s ease !important;
      overflow: hidden !important;
    }
    .swagger-ui .opblock:hover { transform: translateY(-1px) !important; box-shadow: 0 6px 20px rgba(0,0,0,0.35) !important; }

    /* GET */
    .swagger-ui .opblock.opblock-get {
      background: rgba(6,182,212,0.06) !important;
      border-color: rgba(6,182,212,0.3) !important;
    }
    .swagger-ui .opblock.opblock-get .opblock-summary { border-color: rgba(6,182,212,0.3) !important; }
    .swagger-ui .opblock.opblock-get .opblock-summary-method {
      background: linear-gradient(135deg, #0891b2, #06b6d4) !important;
      border-radius: 6px !important; font-weight: 700 !important; min-width: 70px !important;
      font-family: 'JetBrains Mono', monospace !important;
    }

    /* POST */
    .swagger-ui .opblock.opblock-post {
      background: rgba(34,197,94,0.06) !important;
      border-color: rgba(34,197,94,0.3) !important;
    }
    .swagger-ui .opblock.opblock-post .opblock-summary { border-color: rgba(34,197,94,0.3) !important; }
    .swagger-ui .opblock.opblock-post .opblock-summary-method {
      background: linear-gradient(135deg, #16a34a, #22c55e) !important;
      border-radius: 6px !important; font-weight: 700 !important; min-width: 70px !important;
      font-family: 'JetBrains Mono', monospace !important;
    }

    /* PUT */
    .swagger-ui .opblock.opblock-put {
      background: rgba(249,115,22,0.06) !important;
      border-color: rgba(249,115,22,0.3) !important;
    }
    .swagger-ui .opblock.opblock-put .opblock-summary { border-color: rgba(249,115,22,0.3) !important; }
    .swagger-ui .opblock.opblock-put .opblock-summary-method {
      background: linear-gradient(135deg, #ea580c, #f97316) !important;
      border-radius: 6px !important; font-weight: 700 !important; min-width: 70px !important;
      font-family: 'JetBrains Mono', monospace !important;
    }

    /* PATCH */
    .swagger-ui .opblock.opblock-patch {
      background: rgba(168,85,247,0.06) !important;
      border-color: rgba(168,85,247,0.3) !important;
    }
    .swagger-ui .opblock.opblock-patch .opblock-summary { border-color: rgba(168,85,247,0.3) !important; }
    .swagger-ui .opblock.opblock-patch .opblock-summary-method {
      background: linear-gradient(135deg, #9333ea, #a855f7) !important;
      border-radius: 6px !important; font-weight: 700 !important; min-width: 70px !important;
      font-family: 'JetBrains Mono', monospace !important;
    }

    /* DELETE */
    .swagger-ui .opblock.opblock-delete {
      background: rgba(239,68,68,0.06) !important;
      border-color: rgba(239,68,68,0.3) !important;
    }
    .swagger-ui .opblock.opblock-delete .opblock-summary { border-color: rgba(239,68,68,0.3) !important; }
    .swagger-ui .opblock.opblock-delete .opblock-summary-method {
      background: linear-gradient(135deg, #dc2626, #ef4444) !important;
      border-radius: 6px !important; font-weight: 700 !important; min-width: 70px !important;
      font-family: 'JetBrains Mono', monospace !important;
    }

    /* ── Summary Row ── */
    .swagger-ui .opblock-summary-path {
      color: #e2e8f0 !important;
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 14px !important;
      font-weight: 500 !important;
    }
    .swagger-ui .opblock-summary-description {
      color: #64748b !important;
      font-size: 13px !important;
    }
    .swagger-ui .opblock-summary-path__deprecated { color: #ef4444 !important; }

    /* ── Expanded section ── */
    .swagger-ui .opblock-body { background: #0d1321 !important; }
    .swagger-ui .opblock-description-wrapper p { color: #94a3b8 !important; }
    .swagger-ui .tab li { color: #64748b !important; }
    .swagger-ui .tab li.active { color: #6366f1 !important; border-bottom: 2px solid #6366f1 !important; }
    .swagger-ui .parameters-col_description p { color: #94a3b8 !important; }
    .swagger-ui table.parameters tr td { color: #94a3b8 !important; border-color: rgba(255,255,255,0.06) !important; }
    .swagger-ui table.parameters tr th { color: #64748b !important; border-color: rgba(255,255,255,0.06) !important; }
    .swagger-ui .parameter__name { color: #a5b4fc !important; font-family: 'JetBrains Mono', monospace !important; }
    .swagger-ui .parameter__type  { color: #67e8f9 !important; font-size: 12px !important; font-family: 'JetBrains Mono', monospace !important; }
    .swagger-ui .parameter__in    { color: #34d399 !important; font-size: 11px !important; }

    /* ── Code / pre ── */
    .swagger-ui .microlight, .swagger-ui pre.microlight {
      background: #0a0e1a !important;
      border: 1px solid rgba(99,102,241,0.2) !important;
      border-radius: 8px !important;
      color: #a5b4fc !important;
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 13px !important;
      padding: 16px !important;
    }

    /* ── Buttons ── */
    .swagger-ui .btn {
      border-radius: 8px !important;
      font-family: 'Inter', sans-serif !important;
      font-weight: 600 !important;
      font-size: 13px !important;
      transition: all 0.2s ease !important;
      letter-spacing: 0.02em !important;
    }
    .swagger-ui .btn.execute {
      background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
      border: none !important;
      color: white !important;
      padding: 10px 24px !important;
    }
    .swagger-ui .btn.execute:hover {
      background: linear-gradient(135deg, #4f46e5, #7c3aed) !important;
      box-shadow: 0 4px 15px rgba(99,102,241,0.4) !important;
      transform: translateY(-1px) !important;
    }
    .swagger-ui .btn.try-out__btn {
      border: 1px solid rgba(99,102,241,0.5) !important;
      color: #a5b4fc !important;
      background: rgba(99,102,241,0.1) !important;
    }
    .swagger-ui .btn.try-out__btn:hover {
      background: rgba(99,102,241,0.2) !important;
      border-color: #6366f1 !important;
    }
    .swagger-ui .btn.cancel {
      border: 1px solid rgba(239,68,68,0.4) !important;
      color: #f87171 !important;
      background: rgba(239,68,68,0.08) !important;
    }
    .swagger-ui .btn.authorize {
      background: linear-gradient(135deg, #059669, #10b981) !important;
      border: none !important;
      color: white !important;
    }

    /* ── Textarea / Inputs ── */
    .swagger-ui textarea, .swagger-ui input[type=text], .swagger-ui input[type=email] {
      background: #1e293b !important;
      border: 1px solid rgba(99,102,241,0.3) !important;
      border-radius: 8px !important;
      color: #e2e8f0 !important;
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 13px !important;
      padding: 10px !important;
    }
    .swagger-ui textarea:focus, .swagger-ui input[type=text]:focus {
      border-color: #6366f1 !important;
      outline: none !important;
      box-shadow: 0 0 0 2px rgba(99,102,241,0.2) !important;
    }

    /* ── Response section ── */
    .swagger-ui .responses-inner { background: #0d1321 !important; padding: 16px !important; }
    .swagger-ui .response-col_status { color: #34d399 !important; font-weight: 700 !important; font-family: 'JetBrains Mono', monospace !important; }
    .swagger-ui .response-col_description p { color: #94a3b8 !important; }
    .swagger-ui .response-col_links { color: #64748b !important; }
    .swagger-ui .response .response-col_status { font-size: 15px !important; }
    .swagger-ui table.responses-table tr td { border-color: rgba(255,255,255,0.05) !important; }
    .swagger-ui table.responses-table tr th { color: #64748b !important; border-color: rgba(255,255,255,0.05) !important; }

    /* ── Labels & text ── */
    .swagger-ui label { color: #94a3b8 !important; font-size: 13px !important; }
    .swagger-ui h4, .swagger-ui h5 { color: #e2e8f0 !important; }
    .swagger-ui .body-param__text { color: #94a3b8 !important; }
    .swagger-ui .opblock-section-header h4 { color: #94a3b8 !important; font-size: 13px !important; font-weight: 600 !important; text-transform: uppercase !important; letter-spacing: 0.05em !important; }
    .swagger-ui .opblock-section-header { background: rgba(0,0,0,0.3) !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; }

    /* ── Models Section ── */
    .swagger-ui section.models { border: 1px solid rgba(99,102,241,0.2) !important; border-radius: 12px !important; margin: 8px 24px !important; background: #111827 !important; }
    .swagger-ui section.models h4 { color: #e2e8f0 !important; font-size: 16px !important; }
    .swagger-ui section.models .model-container { background: #0d1321 !important; border-radius: 8px !important; }
    .swagger-ui .model { color: #94a3b8 !important; font-family: 'JetBrains Mono', monospace !important; font-size: 13px !important; }
    .swagger-ui .model-title { color: #a5b4fc !important; font-weight: 700 !important; }
    .swagger-ui .prop-type { color: #67e8f9 !important; }
    .swagger-ui .prop-format { color: #34d399 !important; }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #0a0e1a; }
    ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.7); }

    /* ── Copy curl button ── */
    .swagger-ui .curl-command .copy-to-clipboard { background: rgba(99,102,241,0.2) !important; border: 1px solid rgba(99,102,241,0.3) !important; border-radius: 6px !important; }
    .swagger-ui .copy-to-clipboard button { color: #a5b4fc !important; }

    /* ── Required badge ── */
    .swagger-ui .parameter__name.required::after {
      color: #f87171 !important;
    }
    .swagger-ui .parameter__name.required span { color: #f87171 !important; }

    /* ── Content type selector ── */
    .swagger-ui .content-type { color: #94a3b8 !important; font-size: 13px !important; }

    /* ── Loading ── */
    .swagger-ui .loading-container .loading::after { border-color: #6366f1 transparent #6366f1 transparent !important; }
  `,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: "list",
    filter: true,
    showExtensions: true,
    tryItOutEnabled: true,
    defaultModelsExpandDepth: 2,
    defaultModelExpandDepth: 2,
    syntaxHighlight: {
      activate: true,
      theme: "monokai",
    },
  },
};

// ── Swagger UI Route ─────────────────────────────────────────
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// ── Swagger JSON (raw spec) ──────────────────────────────────
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// ── API Routes ───────────────────────────────────────────────
app.use("/api/users",    usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders",   ordersRouter);
app.use("/api/posts",    postsRouter);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Server health check
 *     tags: [Health]
 *     description: Returns server status, uptime, memory usage, and environment info. Useful to verify EC2 deployment is live.
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: 🚀 Server is up and running!
 *                 environment:
 *                   type: string
 *                   example: development
 *                 uptime:
 *                   type: string
 *                   example: 2m 15s
 *                 memory:
 *                   type: object
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get("/health", (req, res) => {
  const uptimeSec = Math.floor(process.uptime());
  const mins = Math.floor(uptimeSec / 60);
  const secs = uptimeSec % 60;
  res.json({
    status:      "OK",
    message:     "🚀 Server is up and running!",
    environment: process.env.NODE_ENV || "development",
    port:        PORT,
    uptime:      `${mins}m ${secs}s`,
    memory: {
      heapUsed:  `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
      rss:       `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
    },
    nodeVersion: process.version,
    timestamp:   new Date().toISOString(),
  });
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint — API overview
 *     tags: [Health]
 *     description: Returns a JSON overview of all available API endpoints.
 *     responses:
 *       200:
 *         description: API overview
 */
app.get("/", (req, res) => {
  res.json({
    message: "🚀 AWS EC2 Backend Testing API",
    version: "1.0.0",
    docs:    `http://localhost:${PORT}/api-docs`,
    health:  `http://localhost:${PORT}/health`,
    endpoints: {
      users:    `http://localhost:${PORT}/api/users`,
      products: `http://localhost:${PORT}/api/products`,
      orders:   `http://localhost:${PORT}/api/orders`,
      posts:    `http://localhost:${PORT}/api/posts`,
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  });
});

// ── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.method} ${req.originalUrl}' not found`,
    hint:    `Visit http://localhost:${PORT}/api-docs for all available routes`,
  });
});

// ── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:   process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  });
});

// ── Start Server ─────────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
  console.log("\n╔══════════════════════════════════════════════════════╗");
  console.log("║        🚀  AWS EC2 Backend Testing API               ║");
  console.log("╠══════════════════════════════════════════════════════╣");
  console.log(`║  Server running on  →  http://localhost:${PORT}         ║`);
  console.log(`║  Swagger UI         →  http://localhost:${PORT}/api-docs ║`);
  console.log(`║  Health Check       →  http://localhost:${PORT}/health   ║`);
  console.log("╠══════════════════════════════════════════════════════╣");
  console.log("║  API Endpoints:                                      ║");
  console.log(`║    GET/POST/PUT/PATCH/DELETE  /api/users             ║`);
  console.log(`║    GET/POST/PUT/PATCH/DELETE  /api/products          ║`);
  console.log(`║    GET/POST/PUT/PATCH/DELETE  /api/orders            ║`);
  console.log(`║    GET/POST/PUT/PATCH/DELETE  /api/posts             ║`);
  console.log("╚══════════════════════════════════════════════════════╝\n");
});

module.exports = app;
