
// Nota: Em uma implementação real, esses tokens não deveriam estar no código do front-end
// Idealmente, eles deveriam ser gerenciados através de um backend seguro ou OAuth

import { toast } from "sonner";

const DEEPSEEK_API_KEY = "sk-b8df50ab1cd244149d65e64c287b34f3";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndicHBuZm5sa2l6dGFoenFrZmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MDUxMjksImV4cCI6MjA1ODE4MTEyOX0.zGMLR4-mklzQ8RI1WZH0U9vFInWbbbwoC6cl19hEuTE";

type QuestionParams = {
  competition: string;
  difficulty: string;
};

type QuestionResponse = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export const generateQuestion = async (params: QuestionParams): Promise<QuestionResponse | null> => {
  try {
    console.log("Gerando questão com parâmetros:", params);
    
    // Configuração para a chamada à API DeepSeek
    const prompt = `
      Gere uma questão de múltipla escolha para o concurso ${params.competition} com nível de dificuldade ${params.difficulty}.
      A questão deve ser baseada em editais anteriores deste concurso ou conteúdo típico para esta área.
      Forneça 5 alternativas, sendo apenas uma correta.
      
      Responda APENAS no seguinte formato JSON:
      {
        "question": "O texto da pergunta aqui",
        "options": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D", "Alternativa E"],
        "answer": 0, // Índice da resposta correta (0 a 4)
        "explanation": "Explicação detalhada da resposta correta"
      }
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
            content: "Você é um assistente especializado em gerar questões para concursos públicos brasileiros. Você conhece todas as leis e normas atualizadas e sabe criar questões com diferentes níveis de dificuldade."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
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
      explanation: "A alternativa correta é a que afirma que os tratados internacionais sobre direitos humanos aprovados com quórum qualificado têm status de norma constitucional. Isso está previsto no §3º do art. 5º da Constituição Federal, incluído pela Emenda Constitucional nº 45/2004, que estabelece que 'os tratados e convenções internacionais sobre direitos humanos que forem aprovados, em cada Casa do Congresso Nacional, em dois turnos, por três quintos dos votos dos respectivos membros, serão equivalentes às emendas constitucionais'."
    };
  }
};
