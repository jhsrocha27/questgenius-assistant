
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChevronRight, Brain, Send, CopyCheck, RotateCcw, Loader2 } from "lucide-react";

type QuestionType = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

const difficultyLevels = [
  { value: "facil", label: "Fácil" },
  { value: "medio", label: "Médio" },
  { value: "dificil", label: "Difícil" },
];

const QuestionGenerator: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [competition, setCompetition] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const generateSampleQuestion = () => {
    setIsGenerating(true);

    // Simulating API call delay
    setTimeout(() => {
      // Sample question (in real implementation, this would come from the API)
      const sampleQuestion: QuestionType = {
        question: "Em relação ao controle de constitucionalidade no sistema jurídico brasileiro, assinale a alternativa correta:",
        options: [
          "O controle difuso de constitucionalidade só pode ser exercido pelo Supremo Tribunal Federal.",
          "No controle concentrado, qualquer juiz ou tribunal pode declarar a inconstitucionalidade de uma norma.",
          "A Ação Direta de Inconstitucionalidade (ADI) pode ser proposta por qualquer cidadão brasileiro.",
          "O controle difuso ocorre quando um juiz ou tribunal declara a inconstitucionalidade de uma norma em um caso concreto.",
        ],
        answer: 3, // Index of the correct answer (0-based)
        explanation: "O controle difuso ou concreto de constitucionalidade é aquele exercido por qualquer juiz ou tribunal no curso de um processo judicial, analisando a constitucionalidade de uma norma diante de um caso concreto. As demais alternativas contêm erros: o controle difuso não é exclusivo do STF; no controle concentrado, apenas o tribunal competente (geralmente o STF) pode declarar a inconstitucionalidade; e a ADI só pode ser proposta pelos legitimados no art. 103 da Constituição Federal, não por qualquer cidadão.",
      };

      setQuestion(sampleQuestion);
      setIsGenerating(false);
      setIsAnswered(false);
      setSelectedOption(null);
    }, 2000);
  };

  const handleNextStep = () => {
    if (step === 1 && !competition.trim()) {
      toast.error("Por favor, informe o concurso desejado.");
      return;
    }
    
    if (step === 2 && !difficulty) {
      toast.error("Por favor, selecione o nível de dificuldade.");
      return;
    }
    
    if (step === 3) {
      generateSampleQuestion();
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
      toast.success("Resposta correta!");
    } else {
      toast.error("Resposta incorreta!");
    }
  };

  const generateNewQuestion = () => {
    setQuestion(null);
    generateSampleQuestion();
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
                  <Input
                    placeholder="Ex: Concurso TRT, Concurso Polícia Federal..."
                    value={competition}
                    onChange={(e) => setCompetition(e.target.value)}
                    className="transition-all-300"
                  />
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Escolha o nível de dificuldade das questões:</h3>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="w-full transition-all-300">
                      <SelectValue placeholder="Selecione o nível de dificuldade" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
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
                    Vamos gerar questões de {difficulty === "facil" ? "fácil" : difficulty === "medio" ? "média" : "difícil"} dificuldade para o concurso: <span className="font-medium text-foreground">{competition}</span>
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
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {difficulty === "facil" ? "Fácil" : difficulty === "medio" ? "Médio" : "Difícil"}
                </span>
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
                        {option}
                      </Label>
                      {isAnswered && index === question.answer && (
                        <CopyCheck className="ml-auto flex-shrink-0 h-5 w-5 text-green-600" />
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {isAnswered && (
                <div className="rounded-md border p-4 mt-4 bg-secondary/50 animate-fade-in-up">
                  <h4 className="font-medium mb-2">Explicação:</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end gap-3 pt-4">
          {step <= 3 && !question && (
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
