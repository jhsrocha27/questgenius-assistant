
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Brain, Send, RotateCcw } from "lucide-react";
import { generateQuestion } from "@/services/apiService";
import QuestionForm from "./question-generator/QuestionForm";
import QuestionDisplay from "./question-generator/QuestionDisplay";
import QuestionExplanation from "./question-generator/QuestionExplanation";
import LoadingState from "./question-generator/LoadingState";
import { QuestionType } from "./question-generator/types";

const QuestionGenerator: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [competition, setCompetition] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [explanationTab, setExplanationTab] = useState<string>("general");

  const handleSelectCompetition = (selectedCompetition: string) => {
    setCompetition(selectedCompetition);
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
          {step <= 3 && !question && !isGenerating && (
            <QuestionForm
              step={step}
              competition={competition}
              subject={subject}
              onSelectCompetition={handleSelectCompetition}
              onSetSubject={setSubject}
              onNextStep={handleNextStep}
              onReset={resetSelection}
              onGenerateQuestion={generateNewQuestion}
            />
          )}
          
          {isGenerating && <LoadingState />}
          
          {question && (
            <div className="space-y-6">
              <QuestionDisplay
                question={question}
                competition={competition}
                subject={subject}
                selectedOption={selectedOption}
                isAnswered={isAnswered}
                onSelectOption={handleSelectOption}
              />
              
              {isAnswered && (
                <QuestionExplanation
                  question={question}
                  isCorrect={isCorrect}
                  explanationTab={explanationTab}
                  onTabChange={setExplanationTab}
                />
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end gap-3 pt-4">
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
