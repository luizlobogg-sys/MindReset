# MindReset V3 — APK automático pelo GitHub Actions

Esta versão foi estruturada para você editar o código pelo celular e deixar o GitHub compilar o APK automaticamente.

## Fluxo

1. Você altera `www/index.html`.
2. Envia/commita a alteração para a branch `main`.
3. O GitHub Actions detecta o `push` automaticamente.
4. O projeto Android é criado com Capacitor.
5. O APK Debug é compilado.
6. O arquivo `MindReset.apk` aparece como artefato da execução.

O workflow também pode ser iniciado manualmente em **Actions → Build MindReset APK → Run workflow**.

## Estrutura

```text
MindReset_V3_Cell/
├── www/
│   └── index.html
├── .github/
│   └── workflows/
│       └── build-apk.yml
├── package.json
├── capacitor.config.json
└── README.md
```

## Como usar somente pelo celular

### 1. Criar o repositório

Crie um repositório no GitHub. Recomenda-se usar um repositório público para simplificar o uso do GitHub Actions sem configurações adicionais.

### 2. Enviar os arquivos

Envie para a raiz do repositório:

- `package.json`
- `capacitor.config.json`
- pasta `www` com `index.html`
- pasta `.github/workflows` com `build-apk.yml`

A estrutura precisa ficar exatamente como mostrada acima.

### 3. Fazer uma alteração

Sempre que você editar `www/index.html` e fizer **Commit changes** na branch `main`, a compilação será iniciada automaticamente.

### 4. Baixar o APK

No GitHub:

**Actions → Build MindReset APK → execução mais recente → Artifacts → MindReset-APK**

Baixe o ZIP do artefato, extraia e instale `MindReset.apk` no Android.

## Importante

O APK gerado é uma versão **Debug**, adequada para testes, apresentação e instalação direta. Para publicar na Google Play, posteriormente será necessário configurar assinatura/release.
