
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, PenTool } from "lucide-react";
import { QuestionType } from "./types";

interface QuestionExplanationProps {
  question: QuestionType;
  isCorrect: boolean;
  explanationTab: string;
  onTabChange: (value: string) => void;
}

const QuestionExplanation: React.FC<QuestionExplanationProps> = ({
  question,
  isCorrect,
  explanationTab,
  onTabChange
}) => {
  // Helper to display the letter of the option
  const getOptionLetter = (index: number): string => {
    return String.fromCharCode(65 + index); // A, B, C, D, E...
  };

  return (
    <div className="rounded-md border mt-4 animate-fade-in-up overflow-hidden">
      <Tabs value={explanationTab} onValueChange={onTabChange}>
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
  );
};

export default QuestionExplanation;
