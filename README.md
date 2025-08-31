Este é um projeto [Next.js](https://nextjs.org) criado com [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Começando

Primeiro, execute o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado. (apos iniciar com `npm run dev`)

Você pode começar a editar a página modificando `app/home/page.tsx`. A página é atualizada automaticamente à medida que você edita o arquivo.

# Perfis de Usuário

## Credenciais

- Usuario padrão (funcional): `standard_user`
- Usuario com bugs (problem): `problem_user`
- Senha (para ambos): `password`

Login implementado em `src/context/AuthContext.tsx`. Ao entrar com o usuario determinado, a flag de problema é ativada; ao deslogar, é desativada.

Implementação da flag: `src/lib/flags.ts` (`isProblemUser`, `setProblemUser`).

## standard_user — fluxo limpo (sem bugs)

Tudo funciona normalmente:

- Fluxo funciona normalmente

## problem_user — bugs intencionais

Quando a flag de problem user está ativa, os seguintes comportamentos são alterados propositalmente:

- Busca por digitação no Header não atualiza a lista; digitar não filtra produtos.
  - Origem: `src/components/Header.tsx` (desativa atualização de URL quando `isProblemUser()`).
- Imagens dos produtos não aparecem (mantém layout, oculta a imagem).
  - Origem: `src/components/ProductCard.tsx` (renderização condicional pela flag).
- Rotas trocadas no Header: “Sobre” redireciona para `/cart` e o ícone do carrinho para `/about`.
  - Origem: `src/components/Header.tsx` (links condicionais pela flag).
- Ordenação por preço invertida: selecionar “crescente” aplica decrescente e vice-versa.
  - Origem: `src/app/home/page.tsx` (comparadores invertidos quando `isProblemUser()`).
