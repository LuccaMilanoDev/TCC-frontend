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
- Usuario bloqueado: `locked_out_user`
- Usuario com bugs visuais: `visual_user`
- Senha (para todos): `password`

Login implementado em `src/context/AuthContext.tsx`. Ao entrar com o usuario determinado, as flags correspondentes são ativadas; ao deslogar, são desativadas.

Implementação das flags: `src/lib/flags.ts` (`isProblemUser`/`setProblemUser`, `isPerformanceUser`/`setPerformanceUser`, `isVisualUser`/`setVisualUser`).

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

## locked_out_user — usuário bloqueado

Quando este usuário tenta fazer login com a senha padrão, o acesso é negado e uma mensagem é exibida:

- Mensagem exibida: `Desculpe esse usuario foi bloqueado 🙂`
  - Origem: `src/context/AuthContext.tsx` (retorno de erro específico no método `login()` quando `username === "locked_out_user"`).

## visual_user — bugs visuais intencionais

Quando a flag de visual user está ativa, são introduzidas falhas visuais propositais:

- Header desalinhado e logo levemente rotacionado; borda tracejada vermelha no header.
  - Origem: `src/components/Header.tsx` (classes condicionais quando `isVisualUser()`).
- Badge do carrinho posicionado do lado errado (sobreposição à esquerda em vez de à direita).
  - Origem: `src/components/Header.tsx` (classe da badge alternada por `isVisualUser()`).
- Cards com imagem errada e recorte distorcido (ex.: usa `/camisa.png` para outros produtos, `object-cover` com `scale`).
  - Origem: `src/components/ProductCard.tsx` (troca de `src`, `className` com `object-cover`, `scale-125`, etc. quando `isVisualUser()`).
- Texto do produto desalinhado (direita), ordem dos elementos alterada e preço posicionado de forma estranha (absoluto no topo-direita).
  - Origem: `src/components/ProductCard.tsx` (classes e ordem condicionais por `isVisualUser()`).
- Grid com espaçamentos irregulares, skew e itens desalinhados verticalmente.
  - Origem: `src/components/ProductGrid.tsx` (gap assimétrico, `skew-y-1` e deslocamentos por índice quando `isVisualUser()`).

## auth_expired_user — usuario com expiracao de sessao

Quando este usuario faz login temos um timer de 15 segundos para expirar a sessao.