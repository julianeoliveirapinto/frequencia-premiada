# FREQ-016 — Ranking privado do aluno

## Implementação

- `GET /alunos/me/ranking` exige token de aluno, consulta sua turma pelo ID do token e retorna posição e pontos próprios, nível/progresso e até cinco posições com iniciais. Turmas com menos de seis estudantes não exibem a lista coletiva.
- A rota anterior `GET /alunos/ranking/:turmaId` continua disponível ao painel do professor, mas agora recusa token de aluno.
- Pontuação de presença e limites de níveis ficam em `backend/src/gamification/rules.ts`. Os limites já apareciam no dashboard web; a tela mobile usa a resposta do servidor. **Marcela deve confirmar as regras e a linguagem em FREQ-018 antes da aprovação final.** Nenhuma recompensa ou certificado é prometido pela tela mobile.
- A aba mobile consulta a API ao receber foco e nunca soma pontos localmente. Sem resposta, apresenta erro e permite tentar novamente.

## Configuração mobile

Copie `mobile/.env.example` para `mobile/.env` e defina `EXPO_PUBLIC_API_URL` com o endereço da API acessível no aparelho. Essa variável é pública no aplicativo; não coloque segredos nela. Reinicie o Expo após mudar a configuração.

## Verificação

Na pasta `backend`: `npm ci`, `npm run build` e `npx jest tests/ranking.test.ts --runInBand`.
Na pasta `mobile`: `npm ci` e `npx tsc --noEmit`.

Teste manual em aparelho Android pequeno e maior: login de aluno, posição, progresso, aba de ranking, carregamento, falta de rede, retorno à aba depois de nova presença, fonte ampliada e navegação inferior com cinco abas. Use duas turmas e confira que um aluno não recebe dados de outra turma nem nomes completos dos colegas.

## Pendências de integração

- A política de apelido aprovado ainda não existe no esquema. Por isso a API envia apenas iniciais, e oculta lista coletiva em turma pequena. Definir política de privacidade para turmas em que mesmo iniciais identifiquem colegas.
- FREQ-008 deve confirmar o contrato do ranking seguro e FREQ-018 deve validar os limites de níveis e textos com Marcela.
- FREQ-013 deve concluir a separação de permissões no restante do aplicativo. A branch base ainda contém tela de presença manual no fluxo de aluno.
- Requisições duplicadas de presença nas rotas antigas ainda podem gerar pontos duplicados no servidor em condições de corrida. A tela mobile não duplica pontos; tornar a gravação idempotente depende do identificador oficial de aula/chamada.
