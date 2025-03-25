
import { toast } from "sonner";

// Interface for edital data
export interface EditalInfo {
  competition: string;
  year: number;
  subjects: string[];
  url?: string;
}

// Database of the latest editals for each competition
// In a real implementation, this would come from an API or database
const latestEditals: Record<string, EditalInfo> = {
  "TJSP": {
    competition: "TJSP",
    year: 2024,
    subjects: ["Direito Constitucional", "Direito Administrativo", "Direito Civil", "Direito Processual Civil", "Direito Penal", "Direito Processual Penal", "Legislação Específica"],
    url: "https://conhecimento.fgv.br/concursos/tjsp23"
  },
  "TJMG": {
    competition: "TJMG", 
    year: 2023,
    subjects: ["Direito Constitucional", "Direito Administrativo", "Direito Civil", "Direito Processual Civil", "Direito Penal", "Direito Processual Penal", "Legislação Específica"],
    url: "https://conhecimento.fgv.br/concursos/tjmg23"
  },
  "PCSP": {
    competition: "PCSP",
    year: 2024,
    subjects: ["Direito Penal", "Direito Processual Penal", "Criminologia", "Medicina Legal", "Direito Constitucional", "Direitos Humanos", "Legislação Específica"],
    url: "https://www.vunesp.com.br/PCSP2201"
  },
  "PCMG": {
    competition: "PCMG",
    year: 2023,
    subjects: ["Direito Penal", "Direito Processual Penal", "Criminologia", "Medicina Legal", "Direito Constitucional", "Legislação Específica", "Direitos Humanos"],
    url: "https://www.fumarc.com.br/concursos/detalhe/policia-civil-do-estado-de-minas-gerais/84/"
  },
  "PMSP": {
    competition: "PMSP",
    year: 2024,
    subjects: ["Direito Constitucional", "Direito Administrativo", "Direito Penal", "Legislação de Trânsito", "Raciocínio Lógico", "Conhecimentos Específicos"],
    url: "https://www.vunesp.com.br/PMIL2101"
  },
  "PMMG": {
    competition: "PMMG",
    year: 2023,
    subjects: ["Direito Constitucional", "Direito Administrativo", "Direito Penal", "Legislação de Trânsito", "Raciocínio Lógico", "Legislação Institucional"],
    url: "https://www.fumarc.com.br/concursos/detalhe/policia-militar-de-minas-gerais/83/"
  },
  "OAB": {
    competition: "OAB",
    year: 2024,
    subjects: ["Direito Constitucional", "Direito Administrativo", "Direito Civil", "Direito Processual Civil", "Direito Penal", "Direito Processual Penal", "Direito Empresarial", "Direito Tributário", "Direito do Trabalho", "Ética Profissional"],
    url: "https://oab.fgv.br/"
  },
  "INSS": {
    competition: "INSS",
    year: 2023,
    subjects: ["Direito Previdenciário", "Direito Constitucional", "Direito Administrativo", "Raciocínio Lógico", "Informática", "Legislação Previdenciária"],
    url: "https://www.cebraspe.org.br/concursos/inss_22"
  },
  "PF": {
    competition: "PF",
    year: 2024,
    subjects: ["Direito Constitucional", "Direito Administrativo", "Direito Penal", "Direito Processual Penal", "Raciocínio Lógico", "Legislação Específica", "Criminologia"],
    url: "https://www.cebraspe.org.br/concursos/pf_23"
  },
  "PRF": {
    competition: "PRF",
    year: 2023,
    subjects: ["Direito Constitucional", "Direito Administrativo", "Direito Penal", "Legislação de Trânsito", "Raciocínio Lógico", "Legislação Específica"],
    url: "https://www.cebraspe.org.br/concursos/prf_21"
  }
};

// Default subjects for competitions not found in our database
const defaultSubjects = [
  "Português", "Matemática", "Conhecimentos Gerais", 
  "Raciocínio Lógico", "Informática", "Legislação Específica"
];

export const getCompetitionSubjects = (competition: string): string[] => {
  // Check if we have information about this competition
  if (competition in latestEditals) {
    return latestEditals[competition].subjects;
  }
  
  // Handle case where we have a competition with city/state (e.g., "PMSP - São Paulo")
  const baseCompetition = competition.split(' - ')[0];
  if (baseCompetition in latestEditals) {
    return latestEditals[baseCompetition].subjects;
  }

  // Return default subjects if competition not found
  console.log(`Edital information not found for ${competition}, using default subjects`);
  return defaultSubjects;
};

export const getEditalInfo = (competition: string): EditalInfo | null => {
  // Check for exact match
  if (competition in latestEditals) {
    return latestEditals[competition];
  }
  
  // Check for base competition (without location)
  const baseCompetition = competition.split(' - ')[0];
  if (baseCompetition in latestEditals) {
    return latestEditals[baseCompetition];
  }
  
  return null;
};

// For future implementation: fetch edital data from an API
export const fetchEditalInfo = async (competition: string): Promise<EditalInfo | null> => {
  try {
    // This is where you'd make an API call to get the latest edital info
    // For now, we'll just use our static data
    return getEditalInfo(competition);
  } catch (error) {
    console.error("Error fetching edital information:", error);
    toast.error("Não foi possível obter informações do edital.");
    return null;
  }
};
