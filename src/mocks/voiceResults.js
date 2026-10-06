// Mock voice-mode answers (Result screen). Add more entries to show other answers.
// Each: id, historyTitle (short label in the Histórico list), title, date (a short support line — not always a date), subtitle, body.
export const VOICE_RESULTS = [
  {
    id: 'pedro-alvares-cabral',
    historyTitle: 'Descobrimento do Brasil',
    title: 'Pedro Alvares Cabral',
    date: '22 de abril de 1500',
    subtitle: 'Chegada oficial portuguesa',
    body: 'Foi a chegada oficial dos portugueses. Mas povos indígenas já viviam aqui havia milhares de anos, e o navegador espanhol Vicente Pinzón teria passado pelo litoral meses antes. Por isso, muitos historiadores falam em "chegada", e não em "descobrimento".',
  },
  {
    id: 'agenda',
    historyTitle: 'Agenda de hoje',
    title: 'Sua agenda de hoje',
    date: 'Quarta, 24 de setembro',
    subtitle: '3 compromissos',
    body: 'Às 10h você tem reunião de equipe. Às 14h, call com o cliente Atlas. Às 19h, jantar com a Marina no Mocotó. Entre 11h e 13h você está livre. Quer que eu reserve esse tempo para focar?',
  },
  {
    id: 'resumo-emails',
    historyTitle: 'Resumo dos e-mails',
    title: 'Caixa de entrada',
    date: 'Últimas 12 horas',
    subtitle: '4 e-mails importantes',
    body: 'O cliente Atlas aprovou a proposta. O RH pediu a assinatura do aditivo até sexta. A companhia aérea confirmou o voo de segunda. E o síndico avisou que a água será cortada amanhã das 9h às 12h. O resto pode esperar.',
  },
  {
    id: 'resposta-email',
    historyTitle: 'Resposta para Carla',
    title: 'E-mail enviado',
    date: 'Hoje, 10:42',
    subtitle: 'Para Carla, sobre o orçamento',
    body: 'Agradeci o envio, confirmei que o valor está dentro do esperado e pedi a nota fiscal até sexta. Mantive o tom cordial que você costuma usar com ela.',
  },
  {
    id: 'resumo-reuniao',
    historyTitle: 'Reunião de produto',
    title: 'Resumo da reunião',
    date: 'Produto, 45 minutos',
    subtitle: '3 decisões e 4 próximos passos',
    body: 'O time decidiu adiar o lançamento para outubro, priorizar o novo onboarding e testar o plano anual. Próximos passos: Ana revisa o fluxo, Léo atualiza o roadmap, Carla fala com o financeiro e você aprova o cronograma até sexta.',
  },
  {
    id: 'resumo-pdf',
    historyTitle: 'Resumo do relatório anual',
    title: 'Resumo do PDF',
    date: 'Relatório anual, 42 páginas',
    subtitle: '3 pontos principais',
    body: 'A receita cresceu 18% no ano, puxada pelo mercado internacional. Os custos operacionais subiram acima do previsto. E o relatório recomenda reduzir fornecedores de 12 para 6 em 2027.',
  },
  {
    id: 'lembrete',
    historyTitle: 'Lembrete do contador',
    title: 'Lembrete criado',
    date: 'Sexta, 15:00',
    subtitle: 'Ligar para o contador',
    body: 'Vou te avisar na sexta às 15h. Deixei anotado que ele pediu os comprovantes de setembro. Quer que eu reúna esses arquivos antes?',
  },
  {
    id: 'comparacao',
    historyTitle: 'Comparação de notebooks',
    title: 'Comparação pronta',
    date: '3 notebooks até R$ 6.000',
    subtitle: 'Melhor custo-benefício',
    body: 'Para design, o melhor equilíbrio é o modelo com tela de 16 polegadas e 16 GB de memória. Ele tem a melhor tela das três opções e bateria de 10 horas. O mais barato economiza R$ 800, mas tem tela inferior.',
  },
  {
    id: 'viagem',
    historyTitle: 'Roteiro em Lisboa',
    title: 'Roteiro pronto',
    date: 'Lisboa, 4 dias',
    subtitle: 'Outubro, clima ameno',
    body: 'Dia 1 em Belém e Alfama, dia 2 em Sintra, dia 3 no Chiado e Bairro Alto, dia 4 livre para compras. Separei 3 hotéis bem avaliados no centro. A média de temperatura na época é 21 graus.',
  },
  {
    id: 'traducao',
    historyTitle: 'Tradução para o fornecedor',
    title: 'Tradução pronta',
    date: 'Português para inglês',
    subtitle: 'Mensagem para o fornecedor',
    body: 'Traduzi sua mensagem mantendo o tom formal. Pedi a atualização do prazo de entrega e a confirmação do novo valor. O texto está pronto para copiar e enviar.',
  },
  {
    id: 'curiosidade-cafe',
    historyTitle: 'Origem do café',
    title: 'Café',
    date: 'Etiópia, século IX',
    subtitle: 'Origem da bebida',
    body: 'Segundo a lenda, um pastor chamado Kaldi percebeu que suas cabras ficavam agitadas depois de comer frutos de um arbusto. Monges passaram a usar os grãos para ficar acordados nas orações. Do Iêmen, o café chegou à Europa no século XVII.',
  },
]

let lastPickedId = null

// Random response for each voice recording that is sent. Never the same one twice in a row (remembered across sessions
// for as long as the page stays open). `rng` is injectable for tests.
export function pickRandomResult(rng = Math.random) {
  const candidates = VOICE_RESULTS.filter((r) => r.id !== lastPickedId)
  const picked = candidates[Math.min(candidates.length - 1, Math.floor(rng() * candidates.length))]
  lastPickedId = picked.id
  return picked
}
