// Configuração necessária para o SQLite funcionar no navegador
// Adicionar suporte a arquivos .wasm (WebAssembly)
// O SQLite usa WebAssembly para funcionar no navegador
// Configurar cabeçalhos especiais para o navegador
// O SQLite precisa do SharedArrayBuffer para funcionar
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
// Adicionar suporte a arquivos wasm
config.resolver.assetExts.push('wasm');

config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    return middleware(req, res, next);
  };
};

module.exports = config;