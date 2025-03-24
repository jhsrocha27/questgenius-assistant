
// Nota: Em uma implementação real, esses tokens não deveriam estar no código do front-end
// Idealmente, eles deveriam ser gerenciados através de um backend seguro ou OAuth

import { toast } from "sonner";

const DEEPSEEK_API_KEY = "sk-b8df50ab1cd244149d65e64c287b34f3";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndicHBuZm5sa2l6dGFoenFrZmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MDUxMjksImV4cCI6MjA1ODE4MTEyOX0.zGMLR4-mklzQ8RI1WZH0U9vFInWbbbwoC6cl19hEuTE";
const SUPABASE_URL = "https://wbppnfnlkiztahzqkfac.supabase.co";

type QuestionParams = {
  competition: string;
  difficulty: string;
  userId?: string; // Opcional para rastrear questões por usuário
};

type QuestionResponse = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  alternativeExplanations?: string[]; // Explicações para cada alternativa
};

// Interface para comunicação com o Supabase
interface QuestionRecord {
  id?: string;
  competition: string;
  difficulty: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  user_id?: string;
  created_at?: string;
}

// Cache local para rastrear questões já geradas na sessão atual
const questionCache = new Set<string>();

// Função para verificar se uma questão já existe no banco
const checkQuestionExists = async (questionText: string, userId?: string): Promise<boolean> => {
  // Verificar no cache local primeiro
  if (questionCache.has(questionText)) {
    console.log("Questão encontrada no cache local");
    return true;
  }
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/questions?question=eq.${encodeURIComponent(questionText)}${userId ? `&user_id=eq.${userId}` : ''}`, {
      method: "GET",
      headers: {
        "apikey": SUPABASE_API_KEY,
        "Authorization": `Bearer ${SUPABASE_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        // A tabela pode não existir ainda, vamos tentar criá-la
        await createQuestionsTable();
        return false;
      }
      console.error("Erro ao verificar questão no Supabase:", response.statusText);
      return false;
    }

    const data = await response.json();
    const exists = data.length > 0;
    
    if (exists) {
      // Adicionar ao cache local
      questionCache.add(questionText);
    }
    
    return exists;
  } catch (error) {
    console.error("Erro ao verificar questão no Supabase:", error);
    return false;
  }
};

// Função para criar a tabela de questões se não existir
const createQuestionsTable = async (): Promise<boolean> => {
  try {
    // Usando SQL RPC para criar a tabela
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/create_questions_table`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_API_KEY,
        "Authorization": `Bearer ${SUPABASE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });

    return response.ok;
  } catch (error) {
    console.error("Erro ao criar tabela de questões:", error);
    return false;
  }
};

// Função para salvar uma questão no banco
const saveQuestion = async (question: QuestionRecord): Promise<void> => {
  try {
    // Adicionar ao cache local primeiro
    questionCache.add(question.question);
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/questions`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_API_KEY,
        "Authorization": `Bearer ${SUPABASE_API_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(question)
    });

    if (!response.ok) {
      if (response.status === 404) {
        // A tabela pode não existir, vamos tentar criá-la e salvar novamente
        const created = await createQuestionsTable();
        if (created) {
          await saveQuestion(question);
          return;
        }
      }
      throw new Error(`Erro ao salvar questão: ${response.status} - ${response.statusText}`);
    }

    console.log("Questão salva com sucesso no Supabase");
  } catch (error) {
    console.error("Erro ao salvar questão no Supabase:", error);
    toast.error("Não foi possível salvar a questão no banco de dados.");
  }
};

export const generateQuestion = async (params: QuestionParams): Promise<QuestionResponse | null> => {
  try {
    console.log("Gerando questão com parâmetros:", params);
    
    // Aumentar a temperatura para maior variabilidade nas questões
    const temperature = 0.9;
    
    // Configuração para a chamada à API DeepSeek com instruções aprimoradas
    const prompt = `
      Por favor, gere uma questão de múltipla escolha ORIGINAL e ÚNICA para o concurso ${params.competition} com nível de dificuldade ${params.difficulty}.
      
      Siga estas diretrizes específicas:
      
      1. A questão deve ser baseada em editais anteriores deste concurso ou conteúdo típico para esta área.
      2. É MUITO IMPORTANTE que a questão seja DIFERENTE das já geradas anteriormente para este concurso.
      3. Evite questões muito genéricas e prefira conteúdos específicos da área.
      4. Forneça EXATAMENTE 5 alternativas (A, B, C, D, E), sendo apenas uma correta.
      5. Verifique a legislação vigente (2024) para garantir que a resposta esteja atualizada.
      6. Crie uma explicação detalhada para a alternativa correta.
      7. Forneça explicações específicas para CADA alternativa incorreta, explicando por que estão erradas.
      8. Se a questão envolver leis alteradas recentemente, mencione a mudança na explicação.
      9. Use linguagem clara, objetiva e profissional, própria para concursos.
      10. Evite tecnicismos excessivos e prefira exemplos práticos quando possível.
      
      Responda APENAS no seguinte formato JSON:
      {
        "question": "O texto da pergunta aqui",
        "options": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D", "Alternativa E"],
        "answer": 0, // Índice da resposta correta (0 a 4)
        "explanation": "Explicação detalhada da resposta correta, com fundamentação legal quando aplicável",
        "alternativeExplanations": [
          "Explicação sobre por que a alternativa A está correta/incorreta",
          "Explicação sobre por que a alternativa B está incorreta",
          "Explicação sobre por que a alternativa C está incorreta",
          "Explicação sobre por que a alternativa D está incorreta",
          "Explicação sobre por que a alternativa E está incorreta"
        ]
      }
    `;

    // Configuração do sistema da IA com instruções aprimoradas
    const systemInstruction = `
      Você é uma inteligência artificial especializada na geração de questões para concursos públicos brasileiros, com amplo domínio de todas as matérias exigidas para cada concurso e profundo conhecimento das leis vigentes em 2024.

      Suas responsabilidades incluem:
      1. Gerar questões ÚNICAS e ORIGINAIS baseadas em editais de concursos reais
      2. EVITAR REPETIÇÕES de conteúdo, formato ou temas
      3. Garantir que as questões estejam atualizadas conforme a legislação vigente
      4. Elaborar alternativas plausíveis, com apenas uma resposta correta
      5. Fornecer explicações detalhadas para cada alternativa
      6. Utilizar linguagem clara, objetiva e didática
      7. Contextualizar as questões à realidade brasileira
      8. Adaptar o nível de dificuldade conforme solicitado

      Todas as suas questões devem ter alta qualidade didática e representar corretamente os conteúdos cobrados nos concursos públicos brasileiros atuais.
      
      MUITO IMPORTANTE: Para cada solicitação, você DEVE gerar uma questão COMPLETAMENTE NOVA e DIFERENTE das anteriores, mesmo que o tema seja semelhante.
    `;

    // Fazendo a chamada para a API DeepSeek
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: systemInstruction
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: temperature,
        max_tokens: 2000 // Aumentado para acomodar explicações mais detalhadas
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na API DeepSeek:", errorData);
      throw new Error(`Erro na API: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
    }

    const data = await response.json();
    console.log("Resposta da API DeepSeek:", data);
    
    // Extraindo a resposta do modelo LLM
    const content = data.choices[0].message.content;
    
    // Extraindo o JSON da resposta
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Formato de resposta inválido da API");
    }
    
    const questionData = JSON.parse(jsonMatch[0]);
    
    // Validando o formato da resposta
    if (!questionData.question || !Array.isArray(questionData.options) || 
        questionData.answer === undefined || !questionData.explanation) {
      throw new Error("A resposta da API não contém todos os campos necessários");
    }
    
    // Verificar se a questão já existe (para usuários registrados)
    const exists = await checkQuestionExists(questionData.question, params.userId);
    if (exists) {
      console.log("Questão já existente. Solicitando nova questão...");
      // Recursivamente solicitar nova questão
      return generateQuestion(params);
    }
    
    // Salvar a questão no banco de dados (se não estiver em modo de teste)
    try {
      await saveQuestion({
        competition: params.competition,
        difficulty: params.difficulty,
        question: questionData.question,
        options: questionData.options,
        answer: questionData.answer,
        explanation: questionData.explanation,
        user_id: params.userId
      });
    } catch (dbError) {
      console.error("Erro ao salvar questão no banco de dados:", dbError);
      // Continuamos mesmo se falhar o salvamento, para não interromper a experiência
    }
    
    return questionData as QuestionResponse;
  } catch (error) {
    console.error("Erro ao gerar questão:", error);
    
    // Caso ocorra erro na API, retornamos uma questão de fallback para evitar quebra da experiência
    toast.error("Ocorreu um erro ao conectar com a API. Apresentando uma questão de exemplo.");
    
    return {
      question: "De acordo com a Constituição Federal de 1988, assinale a alternativa correta a respeito dos direitos fundamentais:",
      options: [
        "Os direitos fundamentais são absolutos e não podem sofrer limitações em nenhuma hipótese.",
        "Os tratados internacionais sobre direitos humanos aprovados pelo Congresso Nacional são equivalentes às emendas constitucionais, independentemente do quórum de aprovação.",
        "O direito à vida é inviolável, sendo vedada a pena de morte em qualquer hipótese no ordenamento jurídico brasileiro.",
        "Os tratados internacionais sobre direitos humanos aprovados com quórum qualificado têm status de norma constitucional.",
        "Os direitos fundamentais previstos na Constituição constituem um rol taxativo, não admitindo ampliação por outros meios."
      ],
      answer: 3,
      explanation: "A alternativa correta é a que afirma que os tratados internacionais sobre direitos humanos aprovados com quórum qualificado têm status de norma constitucional. Isso está previsto no §3º do art. 5º da Constituição Federal, incluído pela Emenda Constitucional nº 45/2004, que estabelece que 'os tratados e convenções internacionais sobre direitos humanos que forem aprovados, em cada Casa do Congresso Nacional, em dois turnos, por três quintos dos votos dos respectivos membros, serão equivalentes às emendas constitucionais'.",
      alternativeExplanations: [
        "Esta alternativa está incorreta pois os direitos fundamentais, embora sejam essenciais, não são absolutos. Eles podem sofrer limitações em casos específicos, como em estado de sítio ou para proteger outros direitos fundamentais, conforme jurisprudência pacífica do STF.",
        "Esta alternativa está incorreta pois apenas os tratados internacionais sobre direitos humanos aprovados com quórum qualificado (3/5 em dois turnos em cada Casa) têm status de emenda constitucional. Os demais têm status supralegal, conforme entendimento do STF.",
        "Esta alternativa está incorreta pois, embora o direito à vida seja protegido constitucionalmente, a própria Constituição prevê uma exceção para a pena de morte em caso de guerra declarada, conforme art. 5º, XLVII, 'a'.",
        "Esta alternativa está correta. O §3º do art. 5º da CF/88 estabelece que os tratados internacionais sobre direitos humanos aprovados com quórum qualificado têm status de norma constitucional.",
        "Esta alternativa está incorreta pois o STF já reconheceu que o rol de direitos fundamentais da Constituição é exemplificativo (e não taxativo), admitindo a existência de direitos implícitos e decorrentes do regime constitucional."
      ]
    };
  }
};
