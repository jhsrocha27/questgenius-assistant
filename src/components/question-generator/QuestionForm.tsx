
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import CompetitionSelector from "../CompetitionSelector";

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

interface QuestionFormProps {
  step: number;
  competition: string;
  subject: string;
  onSelectCompetition: (competition: string) => void;
  onSetSubject: (subject: string) => void;
  onNextStep: () => void;
  onReset: () => void;
  onGenerateQuestion: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  step,
  competition,
  subject,
  onSelectCompetition,
  onSetSubject,
  onNextStep,
  onReset,
  onGenerateQuestion
}) => {
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);

  // Update available subjects when competition changes
  useEffect(() => {
    if (competition) {
      setAvailableSubjects(competitionSubjects[competition] || defaultSubjects);
    } else {
      setAvailableSubjects([]);
    }
  }, [competition]);

  const handleSelectCompetition = (selectedCompetition: string) => {
    onSelectCompetition(selectedCompetition);
    toast.success(`Concurso "${selectedCompetition}" selecionado!`);
  };

  return (
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
            <Button variant="ghost" size="sm" onClick={onReset}>Alterar</Button>
          </div>
          <Select value={subject} onValueChange={onSetSubject}>
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

      {step <= 3 && step > 1 && (
        <Button
          className="gap-1 transition-all-300"
          onClick={step === 3 ? onGenerateQuestion : onNextStep}
        >
          {step === 3 ? "Gerar Questão" : "Próximo"}
          <ChevronRight size={16} />
        </Button>
      )}
    </div>
  );
};

export default QuestionForm;
