
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from "@/components/ui/command";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { Search, Filter, Check } from "lucide-react";

type CompetitionCategory = {
  name: string;
  competitions: string[];
};

type Region = "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul" | "Nacional";
type EducationLevel = "Fundamental" | "Médio" | "Técnico" | "Superior";

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

interface CompetitionSelectorProps {
  onSelect: (competition: string) => void;
}

const CompetitionSelector: React.FC<CompetitionSelectorProps> = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<Region | "">("");
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<EducationLevel | "">("");
  const [currentTab, setCurrentTab] = useState<string>("categorias");
  
  // Função para mostrar notificação de disponibilidade do concurso
  const handleSelectCompetition = (competition: string) => {
    onSelect(competition);
  };
  
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
                {category.competitions.map((comp) => (
                  <Button 
                    key={comp} 
                    variant="outline" 
                    className="justify-start text-left hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => handleSelectCompetition(comp)}
                  >
                    {comp}
                  </Button>
                ))}
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
                  {category.competitions.map((comp) => (
                    <CommandItem 
                      key={comp}
                      onSelect={() => handleSelectCompetition(comp)}
                      className="cursor-pointer"
                    >
                      {comp}
                    </CommandItem>
                  ))}
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
