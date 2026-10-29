import { createRequire } from 'module';

var require = createRequire(import.meta.url);
var module = { exports: {} };

const config = { plugins: { tailwindcss: {}, autoprefixer: {} } }; export default config;
