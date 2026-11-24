# Portal de Indicadores de Ensino — SINAES / UEMS

Painel web de acompanhamento dos indicadores de qualidade dos cursos de graduação da UEMS (Universidade Estadual de Mato Grosso do Sul), no contexto do SINAES (Sistema Nacional de Avaliação da Educação Superior).

**Responsável:** DIGES/PROE – UEMS · **Repositório:** `diges-uems/indicadores` (GitHub)

---

## 1. O que é e para quem

Site estático que reúne, em um só lugar, os resultados oficiais INEP/MEC (ENADE, IDD, CPC e IGC) dos cursos da UEMS, com comparativos, previsão de cursos que farão o ENADE e evolução histórica das notas. Serve à gestão (reitoria, pró-reitorias, DIGES/PROE), coordenações de curso e demais interessados no monitoramento da qualidade do ensino.

Glossário rápido:
- **ENADE**: Exame Nacional de Desempenho dos Estudantes (conceito/nota de 1 a 5).
- **IDD**: Indicador de Diferença entre os Desempenhos Observado e Esperado.
- **CPC**: Conceito Preliminar de Curso.
- **IGC**: Índice Geral de Cursos (indicador institucional).

## 2. Funcionalidades (abas e indicadores)

A página única (`src/app/page.tsx`) tem quatro abas:

| Aba | O que mostra |
|---|---|
| **Resultados Oficiais (2021-2023)** | Cartões institucionais (IGC e médias ENADE/IDD/CPC), contagem de cursos com conceito 4-5 e 1-2, gráfico de pizza da distribuição de conceitos ENADE, média por campus (unidade universitária), comparativo estadual (UEMS x UFGD x UFMS) e tabela completa de cursos com filtros (curso, grau, campus, status) e ordenação. Clicar em um curso abre modal com histórico e comparação com a média nacional. |
| **ENADE 2025** | Resultados do ENADE 2025 por curso (conceito, concluintes inscritos/participantes, percentual acima do padrão). |
| **Previsão ENADE (2026-2028)** | Cursos previstos para cada ciclo (Anual, 2026, 2027, 2028) com filtros. |
| **Evolução ENADE** | Evolução das notas ENADE por curso ao longo dos anos, com filtros (unidade, código, curso, grau) e botão de atualização. **Carrega dados ao vivo** (ver seção 7). |

Extras: exportação de PDF/impressão do modal de curso, modais de expansão de seções, comparação com médias nacionais por área (`src/data/national-benchmarks.ts`).

## 3. Como funciona

**Arquitetura:** aplicação Next.js em modo **exportação estática** (`output: "export"` em `next.config.ts`). Não há servidor nem banco em produção: o build gera HTML/JS/CSS na pasta `out/`, publicada no GitHub Pages sob o subcaminho `/indicadores` (`basePath` aplicado quando `NODE_ENV=production`).

**Fontes de dados:**
1. **Dados embutidos no código** (pasta `src/data/`), copiados dos resultados oficiais INEP/MEC. Mudam apenas por edição dos arquivos + novo deploy.
2. **Planilha Google via Google Apps Script** (somente aba "Evolução ENADE"): o navegador faz `fetch` direto da URL do Apps Script publicado e recebe JSON; assim essa aba pode ser atualizada sem novo deploy.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui (Radix UI) · Recharts (gráficos) · Framer Motion · Lucide (ícones) · Bun (gerenciador de pacotes/CI).

Observação: o repositório carrega resquícios de um template inicial (Prisma + SQLite em `prisma/` e `db/`, `next-auth`, `Caddyfile`, `.zscripts/`, `examples/websocket`). **Nada disso é usado pelo portal publicado**; o schema Prisma (`User`, `Post`) é apenas o modelo padrão do template.

## 4. Estrutura de pastas

```
src/
  app/            layout.tsx (metadados, fonte), page.tsx (página única e abas), globals.css
  components/
    sinaes/       componentes do portal (header, abas, cartões, gráficos, tabelas, modais)
    ui/           componentes base shadcn/ui
  data/           dados oficiais embutidos (cursos, ENADE 2025, previsão, benchmarks, grau)
  lib/sinaes/     conversão de notas, configuração de status, hook de processamento dos cursos
  hooks/          hooks utilitários
public/           logo.svg, robots.txt
.github/workflows/deploy.yml   deploy automático no GitHub Pages
prisma/, db/, .zscripts/, Caddyfile, examples/, mini-services/   herança do template (não usados no portal)
```

Arquivos de dados principais:
- `course-data.ts`: IDD/CPC/ENADE por curso e ano (2021-2025).
- `enade-2025-data.ts`: resultados do ENADE 2025.
- `forecast-data.ts`: previsão de cursos por ano.
- `national-benchmarks.ts`: médias nacionais por área.
- `institutional-data.ts`: IGC e médias institucionais.
- `grau-map.ts`: grau (Bacharelado/Licenciatura/Tecnológico) por código do curso.
- `state-comparison.ts`: comparativo UEMS x UFGD x UFMS.

## 5. Como rodar localmente

Pré-requisito: [Bun](https://bun.sh) (usado no CI; `bun.lock` presente). Node + npm também devem funcionar (a confirmar).

```bash
bun install
bun run dev      # http://localhost:3000
bun run lint     # ESLint
bun run build    # gera a pasta out/ (site estático)
```

Observação: `bun run dev` usa `tee`, comando de shell Unix (no Windows, rodar em Git Bash ou WSL). O script `start` do `package.json` (`bun .next/standalone/server.js`) é herança do template e não se aplica ao modo de exportação estática; para testar o build, sirva a pasta `out/` com qualquer servidor estático (lembrando do prefixo `/indicadores`).

## 6. Variáveis de ambiente

Não há `.env.example` no repositório. Variáveis reconhecidas (apenas nomes):

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_ENADE_EVOLUTION_API_URL` | (opcional) URL do Apps Script da aba Evolução ENADE. Se ausente, usa a URL padrão definida em `src/components/sinaes/enade-evolution-tab.tsx`. |
| `NODE_ENV` | Em `production` ativa o `basePath` `/indicadores`. |
| `DATABASE_URL` | Apenas template/Prisma (SQLite); **não usada pelo portal**. |

O arquivo `.env` local está no `.gitignore`. Nunca versionar chaves ou segredos.

## 7. Integrações

- **Google Apps Script / Google Sheets**: fonte da aba "Evolução ENADE". O script deve estar publicado como aplicativo web com acesso para "qualquer pessoa" e retornar uma lista JSON de objetos com os campos `u` (unidade), `cod` (código do curso), `cur` (curso), `g` (grau) e `n` (notas por ano). Se a publicação sair do ar ou mudar de formato, a aba exibe mensagem de erro.
- **Recursos externos de imagem/ícone**: favicon e imagem do cabeçalho vêm de `uems.br`; um ícone adicional vem de um bucket Supabase Storage público (ver `layout.tsx` e `header.tsx`).
- **GitHub Pages / GitHub Actions**: hospedagem e deploy.

## 8. Deploy

Automático: todo `push` na branch `main` (ou execução manual via *workflow_dispatch*) dispara `.github/workflows/deploy.yml`, que instala dependências com Bun, roda `bun run build` com `NODE_ENV=production`, cria `.nojekyll` e publica a pasta `out/` no GitHub Pages. Acompanhe na aba *Actions* do repositório. URL pública: normalmente `https://diges-uems.github.io/indicadores/` (a confirmar nas configurações de Pages).

## 9. Como atualizar os dados

**Dados embutidos (resultados oficiais, ENADE 2025, previsão, benchmarks):**
1. Edite o arquivo correspondente em `src/data/` mantendo o formato dos registros existentes (ex.: adicionar `idd2024`, `cpc2024`, `enade2024` em `course-data.ts`).
2. Se mudar o ano de corte das abas, ajuste o `maxYear` em `src/app/page.tsx` e o texto do rodapé ("Última atualização").
3. Rode `bun run build` para validar; faça commit e `push` em `main` (o deploy é automático).

**Aba Evolução ENADE:** basta atualizar a planilha Google ligada ao Apps Script; o site lê os dados na hora (`cache: 'no-store'`), sem novo deploy. Há um botão de atualização na própria aba.

Convenção de notas: onde só há conceito inteiro (2025), o código usa o ponto médio da faixa (1→0,472; 2→1,445; 3→2,445; 4→3,445; 5→4,472), conforme comentário em `course-data.ts`.

## 10. Manutenção e problemas comuns

- **Aba Evolução ENADE com erro ou vazia:** verifique se o Apps Script continua publicado com acesso público, se a URL mudou (atualize a variável `NEXT_PUBLIC_ENADE_EVOLUTION_API_URL` ou o padrão no código) e se o JSON mantém os campos esperados.
- **Site publicado sem CSS/JS (404):** o `basePath` `/indicadores` só vale com `NODE_ENV=production`; em hospedagem em outro caminho, ajuste `next.config.ts`.
- **Build passa mesmo com erros de tipo:** `typescript.ignoreBuildErrors` está `true` em `next.config.ts`; rode `bun run lint` antes de publicar.
- **Curso novo sem grau ou comparativo nacional:** confira se o código do curso está em `grau-map.ts` e se o nome da área existe em `national-benchmarks.ts`.
- **Next.js 16:** possui mudanças incompatíveis; consulte `node_modules/next/dist/docs/` antes de alterar convenções (ver `AGENTS.md`).
- Imagens externas (uems.br, Supabase) podem sair do ar; considere hospedá-las em `public/`.

## 11. Responsável

**DIGES/PROE – UEMS** (expansão das siglas a confirmar).
