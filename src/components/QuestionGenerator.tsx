
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChevronRight, Brain, Send, CopyCheck, RotateCcw, Loader2, BookOpen, PenTool, Book } from "lucide-react";
import { generateQuestion } from "@/services/apiService";
import CompetitionSelector from "./CompetitionSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type QuestionType = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  alternativeExplanations?: string[]; // Explicações para cada alternativa
};

// Subjects for each competition type
const competitionSubjects: Record<string, string[]> = {
  "TJSP": ["Direito Constitucional", "Direito Administrativo", "Direito Civil", "Direito Processual Civil", "Direito Penal"],
  "TJMG": ["Direito Constitucional", "Direito Administrativo", "Direito Civil", "Direito Processual Civil", "Direito Penal"],
  "PCSP": ["Direito Penal", "Direito Processual Penal", "Criminologia", "Medicina Legal", "Direito Constitucional"],
  "PCMG": ["Direito Penal", "Direito Processual Penal", "Criminologia", "Medicina Legal", "Direito Constitucional"],
  "PMSP": ["Direito Constitucional", "Direito Administrativo", "Direito Penal", "Legislação de Trânsito", "Raciocínio Lógico"],
  "PMMG": ["Direito Constitucional", "Direito Administrativo", "Direito Penal", "Legislação de Trânsito", "Raciocínio Lógico"],
  "OAB": ["Direito Constitucional", "Direito Administrativo", "Direito Civil", "Direito Processual Civil", "Direito Penal", "Direito Empresarial", "Direito Tributário", "Direito do Trabalho"],
  "INSS": ["Direito Previdenciário", "Direito Constitucional", "Direito Administrativo", "Raciocínio Lógico", "Informática"],
  "PF": ["Direito Constitucional", "Direito Administrativo", "Direito Penal", "Direito Processual Penal", "Raciocínio Lógico"],
  "PRF": ["Direito Constitucional", "Direito Administrativo", "Direito Penal", "Legislação de Trânsito", "Raciocínio Lógico"]
};

// Default subjects for competitions not in the list
const defaultSubjects = ["Português", "Matemática", "Conhecimentos Gerais", "Raciocínio Lógico", "Informática"];

const QuestionGenerator: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [competition, setCompetition] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [explanationTab, setExplanationTab] = useState<string>("general");

  // Update available subjects when competition changes
  useEffect(() => {
    if (competition) {
      setAvailableSubjects(competitionSubjects[competition] || defaultSubjects);
    } else {
      setAvailableSubjects([]);
    }
    setSubject("");
  }, [competition]);

  const handleSelectCompetition = (selectedCompetition: string) => {
    setCompetition(selectedCompetition);
    toast.success(`Concurso "${selectedCompetition}" selecionado!`);
    setStep(2);
  };

  const generateNewQuestion = async () => {
    if (!competition || !subject) {
      toast.error("Por favor, preencha todos os campos necessários.");
      return;
    }

    setIsGenerating(true);
    setQuestion(null);
    setIsAnswered(false);
    setSelectedOption(null);
    setExplanationTab("general");

    try {
      const response = await generateQuestion({
        competition,
        subject
      });

      if (response) {
        setQuestion(response);
        toast.success("Questão gerada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao gerar questão:", error);
      toast.error("Não foi possível gerar a questão. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextStep = () => {
    if (step === 2 && !subject) {
      toast.error("Por favor, selecione uma matéria.");
      return;
    }
    
    if (step === 3) {
      generateNewQuestion();
    } else {
      setStep(step + 1);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
  };

  const submitAnswer = () => {
    if (selectedOption === null) {
      toast.error("Por favor, selecione uma alternativa.");
      return;
    }
    
    setIsAnswered(true);
    setIsCorrect(selectedOption === question?.answer);
    
    if (selectedOption === question?.answer) {
      toast.success("Resposta correta! Parabéns!");
    } else {
      toast.error("Resposta incorreta. Veja a explicação abaixo!");
    }
  };

  const resetSelection = () => {
    setStep(1);
    setCompetition("");
    setSubject("");
    setQuestion(null);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  // Helper para exibir a letra da alternativa
  const getOptionLetter = (index: number): string => {
    return String.fromCharCode(65 + index); // A, B, C, D, E...
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 animate-fade-in">
      <Card className="w-full border border-border/30 shadow-sm glass-morphism">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-2 text-2xl font-medium text-primary">
            <Brain size={24} className="text-primary" />
            <span>QuestGenius</span>
          </CardTitle>
          <CardDescription>
            Assistente especializado na geração de questões para concursos públicos
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {step <= 3 && !question && (
            <div className="space-y-6 animate-fade-in-up">
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Para qual concurso você deseja estudar?</h3>
                  <CompetitionSelector onSelect={handleSelectCompetition} />
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Escolha a matéria que deseja estudar:</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">Concurso selecionado:</span>
                    <span className="font-medium">{competition}</span>
                    <Button variant="ghost" size="sm" onClick={resetSelection}>Alterar</Button>
                  </div>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="w-full transition-all-300">
                      <SelectValue placeholder="Selecione a matéria" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubjects.map((subj) => (
                        <SelectItem key={subj} value={subj}>
                          {subj}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Pronto para começar!</h3>
                  <p className="text-muted-foreground">
                    Vamos gerar questões sobre <span className="font-medium text-foreground">{subject}</span> para o concurso: <span className="font-medium text-foreground">{competition}</span>
                  </p>
                </div>
              )}
            </div>
          )}
          
          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Gerando questão...</p>
            </div>
          )}
          
          {question && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {subject}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                    {competition}
                  </span>
                </div>
                
                <h3 className="text-lg font-medium leading-7">{question.question}</h3>
                
                <RadioGroup value={selectedOption?.toString()} className="space-y-3 pt-3">
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-2 rounded-md border p-3 transition-all duration-200 ${
                        isAnswered
                          ? index === question.answer
                            ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                            : selectedOption === index
                            ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                            : "bg-background border-border"
                          : selectedOption === index
                          ? "bg-secondary border-primary/30"
                          : "hover:bg-secondary/50 hover:border-primary/20"
                      }`}
                      onClick={() => handleSelectOption(index)}
                    >
                      <RadioGroupItem
                        value={index.toString()}
                        id={`option-${index}`}
                        disabled={isAnswered}
                        className={
                          isAnswered && index === question.answer
                            ? "text-green-600 border-green-600"
                            : isAnswered && selectedOption === index
                            ? "text-red-600 border-red-600"
                            : ""
                        }
                      />
                      <Label
                        htmlFor={`option-${index}`}
                        className="text-sm font-normal leading-relaxed"
                      >
                        <span className="font-medium">{getOptionLetter(index)})</span> {option}
                      </Label>
                      {isAnswered && index === question.answer && (
                        <CopyCheck className="ml-auto flex-shrink-0 h-5 w-5 text-green-600" />
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {isAnswered && (
                <div className="rounded-md border mt-4 animate-fade-in-up overflow-hidden">
                  <Tabs value={explanationTab} onValueChange={setExplanationTab}>
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="general" className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>Explicação Geral</span>
                      </TabsTrigger>
                      <TabsTrigger value="alternatives" className="flex items-center gap-1">
                        <PenTool className="h-4 w-4" />
                        <span>Alternativas Detalhadas</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="general" className="p-4 bg-secondary/50">
                      <h4 className="font-medium mb-2">
                        <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                          {isCorrect ? "Correto! " : "Incorreto. "}
                        </span>
                        Explicação:
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {question.explanation}
                      </p>
                    </TabsContent>
                    
                    <TabsContent value="alternatives" className="bg-secondary/50">
                      <div className="p-4">
                        <h4 className="font-medium mb-2">Análise de cada alternativa:</h4>
                      </div>
                      
                      <div className="space-y-1">
                        {question.options.map((option, index) => (
                          <div 
                            key={index}
                            className={`p-3 border-t ${
                              index === question.answer 
                                ? "bg-green-50/50 dark:bg-green-900/10" 
                                : ""
                            }`}
                          >
                            <p className="text-sm font-medium mb-1 flex items-center">
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 text-xs ${
                                index === question.answer 
                                  ? "bg-green-600 text-white" 
                                  : "bg-secondary text-muted-foreground"
                              }`}>
                                {getOptionLetter(index)}
                              </span>
                              <span className={index === question.answer ? "text-green-600" : ""}>
                                {option}
                              </span>
                            </p>
                            
                            <p className="text-sm text-muted-foreground leading-relaxed ml-8">
                              {question.alternativeExplanations && question.alternativeExplanations[index] 
                                ? question.alternativeExplanations[index]
                                : index === question.answer
                                  ? "Esta é a alternativa correta conforme explicação acima."
                                  : "Esta alternativa está incorreta."}
                            </p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end gap-3 pt-4">
          {step <= 3 && !question && step > 1 && (
            <Button
              className="gap-1 transition-all-300"
              onClick={handleNextStep}
            >
              {step === 3 ? "Gerar Questão" : "Próximo"}
              <ChevronRight size={16} />
            </Button>
          )}
          
          {question && !isAnswered && (
            <Button
              className="gap-1 transition-all-300"
              onClick={submitAnswer}
            >
              Responder
              <Send size={16} />
            </Button>
          )}
          
          {question && isAnswered && (
            <Button
              className="gap-1 transition-all-300"
              onClick={generateNewQuestion}
            >
              Nova Questão
              <RotateCcw size={16} />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuestionGenerator;
