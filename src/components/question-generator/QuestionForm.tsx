
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ChevronRight, FileText, ExternalLink } from "lucide-react";
import CompetitionSelector from "../CompetitionSelector";
import { getCompetitionSubjects, getEditalInfo } from "@/services/editalService";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  const [editalYear, setEditalYear] = useState<number | null>(null);
  const [editalUrl, setEditalUrl] = useState<string | null>(null);

  // Update available subjects when competition changes
  useEffect(() => {
    if (competition) {
      // Get subjects from edital
      const subjects = getCompetitionSubjects(competition);
      setAvailableSubjects(subjects);
      
      // Get additional edital info
      const editalInfo = getEditalInfo(competition);
      if (editalInfo) {
        setEditalYear(editalInfo.year);
        setEditalUrl(editalInfo.url || null);
      } else {
        setEditalYear(null);
        setEditalUrl(null);
      }
    } else {
      setAvailableSubjects([]);
      setEditalYear(null);
      setEditalUrl(null);
    }
  }, [competition]);

  const handleSelectCompetition = (selectedCompetition: string) => {
    onSelectCompetition(selectedCompetition);
    toast.success(`Concurso "${selectedCompetition}" selecionado!`);
  };

  const openEdital = () => {
    if (editalUrl) {
      window.open(editalUrl, '_blank');
    }
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
            
            {editalYear && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <FileText size={14} />
                    <span>Edital {editalYear}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Informações do Edital</h4>
                    <p className="text-sm text-muted-foreground">
                      As matérias listadas foram baseadas no último edital de {editalYear} para o concurso {competition}.
                    </p>
                    {editalUrl && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2 gap-1"
                        onClick={openEdital}
                      >
                        <ExternalLink size={14} />
                        <span>Consultar Edital</span>
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}
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
          {editalYear && (
            <p className="text-sm text-muted-foreground">
              Baseado no edital de {editalYear}
              {editalUrl && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="px-1 h-auto inline-flex items-center gap-1"
                  onClick={openEdital}
                >
                  <ExternalLink size={12} />
                  <span>Ver edital</span>
                </Button>
              )}
            </p>
          )}
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
