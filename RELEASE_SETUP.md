# Configuração da versão oficial

A build de produção é feita pelo workflow `Release MindReset AAB`.

## 1. Gere uma chave de upload

A chave de upload deve ser mantida em segredo. Não coloque o arquivo `.jks` no GitHub.

## 2. Adicione os quatro GitHub Secrets

Repositório → Settings → Secrets and variables → Actions → New repository secret.

Use exatamente:

`MINDRESET_KEYSTORE_B64`

`MINDRESET_KEYSTORE_PASSWORD`

`MINDRESET_KEY_ALIAS`

`MINDRESET_KEY_PASSWORD`

O primeiro valor é o conteúdo Base64 do arquivo `.jks`.

## 3. Gere o AAB

Actions → Release MindReset AAB → Run workflow.

Ou crie uma tag Git, por exemplo `v1.0.0`.

## 4. Baixe

Abra a execução concluída → Artifacts → `MindReset-Release-AAB`.

O arquivo `app-release.aab` é o pacote destinado ao Google Play.
