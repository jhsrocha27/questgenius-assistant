
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
    // Esta é uma simulação - em uma implementação real, aqui chamaria a API DeepSeek
    console.log("Gerando questão com parâmetros:", params);
    console.log("Usando chave DeepSeek:", DEEPSEEK_API_KEY);
    
    // Simula uma resposta
    const response: QuestionResponse = {
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
    
    return response;
  } catch (error) {
    console.error("Erro ao gerar questão:", error);
    toast.error("Ocorreu um erro ao gerar a questão. Tente novamente.");
    return null;
  }
};
