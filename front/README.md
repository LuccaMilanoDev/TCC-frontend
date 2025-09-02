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
- Usuario com problemas de performance: `performance_user`
- Senha (para todos): `password`

Login implementado em `src/context/AuthContext.tsx`. Ao entrar com o usuario determinado, a flag de problema é ativada; ao deslogar, é desativada.

Implementação das flags: `src/lib/flags.ts` (`isProblemUser`, `setProblemUser`, `isPerformanceUser`, `setPerformanceUser`).

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

## performance_user — problemas de performance intencionais

Quando a flag de performance user está ativa, os seguintes comportamentos são alterados para simular problemas de performance:

- Carregamento tardio das imagens dos produtos com delay artificial de 1-3 segundos.
  - Origem: `src/components/ProductCard.tsx` (delay simulado com `setTimeout` e loading lazy quando `isPerformanceUser()`).
- Busca com delay excessivo e debounce longo (800ms + delay adicional de 300-1000ms).
  - Origem: `src/components/Header.tsx` (timeout prolongado e delays artificiais quando `isPerformanceUser()`).
- Filtros com processamento lento artificial de 1-2.5 segundos, interface bloqueada durante o processo.
  - Origem: `src/app/home/page.tsx` (delay simulado no `useMemo` e estado de loading quando `isPerformanceUser()`).
- Scroll com degradação progressiva da performance após 100+ eventos de scroll.
  - Origem: `src/app/home/page.tsx` (listener de scroll que adiciona transições CSS pesadas quando `isPerformanceUser()`).
