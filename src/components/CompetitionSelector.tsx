
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from "@/components/ui/command";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Search, Filter, Check, MapPin } from "lucide-react";
import { toast } from "sonner";

type CompetitionCategory = {
  name: string;
  competitions: string[];
};

type Region = "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul" | "Nacional";
type EducationLevel = "Fundamental" | "Médio" | "Técnico" | "Superior";

// Mapping of competitions to available locations
type CompetitionLocation = {
  [key: string]: string[];
}

const competitionCategories: CompetitionCategory[] = [
  {
    name: "Concursos Federais",
    competitions: ["INSS", "Receita Federal", "IBGE", "Banco Central", "Ministério da Economia"]
  },
  {
    name: "Concursos Estaduais",
    competitions: ["Polícia Civil", "Polícia Militar", "SEFAZ", "Procuradoria Estadual", "Tribunal de Justiça"]
  },
  {
    name: "Concursos Municipais",
    competitions: ["Prefeitura", "Câmara Municipal", "Guarda Municipal", "Secretaria Municipal de Saúde"]
  },
  {
    name: "Carreiras Policiais",
    competitions: ["Polícia Federal", "Polícia Rodoviária Federal", "Polícia Civil", "Polícia Militar", "Polícia Penal"]
  },
  {
    name: "Tribunais",
    competitions: ["STF", "STJ", "TRF", "TRT", "TRE", "TCU", "TCE"]
  },
  {
    name: "Bancos e Instituições Financeiras",
    competitions: ["Banco do Brasil", "Caixa Econômica Federal", "BNDES", "Banco Central"]
  },
  {
    name: "Áreas Administrativas",
    competitions: ["Analista Administrativo", "Técnico Administrativo", "Assistente Administrativo"]
  },
  {
    name: "Áreas Fiscais",
    competitions: ["Auditor Fiscal", "Analista Tributário", "Fiscal de Rendas", "Fiscal de Posturas"]
  },
  {
    name: "Áreas Jurídicas",
    competitions: ["Defensoria Pública", "Procuradoria", "Ministério Público", "Magistratura"]
  },
  {
    name: "Saúde e Educação",
    competitions: ["Professor", "Enfermeiro", "Médico", "Técnico em Enfermagem"]
  },
  {
    name: "Tecnologia da Informação",
    competitions: ["Analista de TI", "Técnico em Informática", "Desenvolvedor", "Analista de Segurança"]
  }
];

const regions: Region[] = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul", "Nacional"];
const educationLevels: EducationLevel[] = ["Fundamental", "Médio", "Técnico", "Superior"];

// Competition locations mapping
const competitionLocations: CompetitionLocation = {
  "Polícia Civil": ["São Paulo", "Rio de Janeiro", "Minas Gerais", "Bahia", "Paraná", "Santa Catarina"],
  "Polícia Militar": ["São Paulo", "Rio de Janeiro", "Minas Gerais", "Espírito Santo", "Goiás", "Pernambuco"],
  "INSS": ["Nacional (todas as regiões)"],
  "Receita Federal": ["Nacional (todas as regiões)"],
  "Banco do Brasil": ["Nacional (todas as regiões)"],
  "Caixa Econômica Federal": ["Nacional (todas as regiões)"],
  "Prefeitura": ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Salvador", "Fortaleza", "Recife", "Porto Alegre"],
  "Professor": ["São Paulo", "Rio de Janeiro", "Minas Gerais", "Paraná", "Bahia", "Goiás", "Distrito Federal"],
  "Enfermeiro": ["São Paulo", "Rio de Janeiro", "Minas Gerais", "Bahia", "Santa Catarina", "Amazonas"],
  "Médico": ["São Paulo", "Rio de Janeiro", "Minas Gerais", "Bahia", "Paraná", "Rio Grande do Sul"],
  // Add default for other competitions
};

// Helper function to get available locations for a competition
const getCompetitionLocations = (competition: string): string[] => {
  return competitionLocations[competition] || ["Nacional (todas as regiões)"];
};

interface CompetitionSelectorProps {
  onSelect: (competition: string) => void;
}

const CompetitionSelector: React.FC<CompetitionSelectorProps> = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<Region | "">("");
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<EducationLevel | "">("");
  const [currentTab, setCurrentTab] = useState<string>("categorias");
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  // Handle competition selection to show locations
  const handleCompetitionClick = (competitionId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event bubbling
    event.preventDefault(); // Prevent default button behavior
    setOpenPopoverId(openPopoverId === competitionId ? null : competitionId);
  };

  // Handle final selection with location confirmation
  const handleLocationSelect = (location: string, competition: string) => {
    setOpenPopoverId(null);
    setSelectedLocation(location);

    // Format the competition string with location if it's not "Nacional"
    const formattedCompetition = location !== "Nacional (todas as regiões)" 
      ? `${competition} - ${location}` 
      : competition;

    onSelect(formattedCompetition);
    toast.success(`Concurso "${formattedCompetition}" selecionado!`);
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openPopoverId) {
        setOpenPopoverId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openPopoverId]);

  // Filtra a lista de concursos com base na pesquisa e filtros
  const filteredCompetitions = competitionCategories.map(category => {
    const filteredList = category.competitions.filter(comp => 
      comp.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return {
      ...category,
      competitions: filteredList
    };
  }).filter(category => category.competitions.length > 0);

  // Create unique IDs for competitions
  const getCompetitionId = (category: string, competition: string) => {
    return `${category}-${competition}`.replace(/\s+/g, '-').toLowerCase();
  };

  return (
    <div className="space-y-4 w-full animate-fade-in">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Pesquisar concurso..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Região</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={selectedRegion} onValueChange={(value) => setSelectedRegion(value as Region | "")}>
                <DropdownMenuRadioItem value="">Todas</DropdownMenuRadioItem>
                {regions.map((region) => (
                  <DropdownMenuRadioItem key={region} value={region}>
                    {region}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Escolaridade</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={selectedEducationLevel} onValueChange={(value) => setSelectedEducationLevel(value as EducationLevel | "")}>
                <DropdownMenuRadioItem value="">Todas</DropdownMenuRadioItem>
                {educationLevels.map((level) => (
                  <DropdownMenuRadioItem key={level} value={level}>
                    {level}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="categorias" value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="categorias" className="flex-1">Por Categorias</TabsTrigger>
          <TabsTrigger value="lista" className="flex-1">Lista Completa</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categorias" className="space-y-4">
          {filteredCompetitions.map((category) => (
            <div key={category.name} className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">{category.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {category.competitions.map((comp) => {
                  const competitionId = getCompetitionId(category.name, comp);
                  return (
                    <div key={competitionId} className="relative">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left hover:bg-primary/10 hover:text-primary transition-colors"
                        onClick={(e) => handleCompetitionClick(competitionId, e)}
                      >
                        {comp}
                      </Button>
                      {openPopoverId === competitionId && (
                        <div className="absolute z-50 w-72 mt-1 rounded-md border bg-popover p-4 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
                          <div className="p-2 border-b">
                            <h4 className="font-medium">Localidades disponíveis:</h4>
                            <p className="text-sm text-muted-foreground">{comp}</p>
                          </div>
                          <div className="max-h-80 overflow-auto p-2">
                            {getCompetitionLocations(comp).map((location, idx) => (
                              <Button 
                                key={idx} 
                                variant="ghost" 
                                className="w-full justify-start text-left my-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLocationSelect(location, comp);
                                }}
                              >
                                <MapPin className="h-4 w-4 mr-2 text-primary" />
                                {location}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="lista">
          <Command className="rounded-lg border shadow-sm">
            <CommandInput placeholder="Buscar concurso..." value={searchQuery} onValueChange={setSearchQuery} />
            <CommandList>
              {filteredCompetitions.map((category) => (
                <CommandGroup key={category.name} heading={category.name}>
                  {category.competitions.map((comp) => {
                    const competitionId = getCompetitionId(category.name, comp);
                    return (
                      <CommandItem 
                        key={competitionId}
                        onSelect={(currentValue) => {
                          handleCompetitionClick(competitionId, { stopPropagation: () => {}, preventDefault: () => {} } as React.MouseEvent);
                        }}
                        className="cursor-pointer relative"
                      >
                        <div className="w-full">{comp}</div>
                        
                        {openPopoverId === competitionId && (
                          <div className="absolute z-50 w-72 left-full ml-1 top-0 rounded-md border bg-popover p-4 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-left-2">
                            <div className="p-2 border-b">
                              <h4 className="font-medium">Localidades disponíveis:</h4>
                              <p className="text-sm text-muted-foreground">{comp}</p>
                            </div>
                            <div className="max-h-80 overflow-auto p-2">
                              {getCompetitionLocations(comp).map((location, idx) => (
                                <Button 
                                  key={idx} 
                                  variant="ghost" 
                                  className="w-full justify-start text-left my-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLocationSelect(location, comp);
                                  }}
                                >
                                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                                  {location}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompetitionSelector;
