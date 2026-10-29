# Rastreador de hábitos — XP

Projeto estático com **HTML + Alpine.js + Tailwind CSS (CDN)**. Sem build ou instalação de dependências para a interface.

## Executar
Abra `index.html` no navegador com conexão à internet (necessária para as CDNs).

## Testes
Com Node.js 22 ou superior:

```bash
npm test
```

O GitHub Actions executa os testes automaticamente em `push` e `pull_request`.

## Demonstração de CI
1. Publique o projeto no GitHub e confira a execução aprovada na aba Actions.
2. Em `app.js`, na função `getProgress`, substitua `Math.round((completed / habits.length) * 100)` por `Math.round((completed / habits.length) * 10)`.
3. Faça um commit e push: o teste de progresso deverá falhar.
4. Restaure o multiplicador `100`, faça outro commit e push: os testes voltam a passar.

A regra testada é propositalmente simples para destacar a **integração contínua**, não a complexidade da aplicação.
