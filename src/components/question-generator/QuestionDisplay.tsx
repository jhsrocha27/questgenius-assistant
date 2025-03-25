
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CopyCheck } from "lucide-react";
import { QuestionType } from "./types";

interface QuestionDisplayProps {
  question: QuestionType;
  competition: string;
  subject: string;
  selectedOption: number | null;
  isAnswered: boolean;
  onSelectOption: (index: number) => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  competition,
  subject,
  selectedOption,
  isAnswered,
  onSelectOption
}) => {
  // Helper to display the letter of the option
  const getOptionLetter = (index: number): string => {
    return String.fromCharCode(65 + index); // A, B, C, D, E...
  };

  return (
    <div className="space-y-4 animate-fade-in">
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
            onClick={() => onSelectOption(index)}
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
  );
};

export default QuestionDisplay;
