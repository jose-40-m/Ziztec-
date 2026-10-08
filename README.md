# ZIZTEC — backend simples

Backend mínimo para ligar o aplicativo ZIZTEC a uma API de geração de música.

1. Instale Node.js 18 ou superior.
2. Execute `npm install`.
3. Crie um arquivo `.env` a partir de `.env.example`.
4. Coloque a sua chave da Stability AI somente no servidor:
   `STABILITY_API_KEY=sua_chave_aqui`
5. Execute `npm start`.
6. Teste `GET /api/health`.

O aplicativo chama `POST /api/music/generate` com título, estilo e letra. O backend envia esses dados para Stable Audio 2.5 e devolve o MP3.

Nunca coloque a chave secreta dentro do APK.
A geração depende dos créditos disponíveis na conta da Stability AI.
