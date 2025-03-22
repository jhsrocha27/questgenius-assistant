
import React from "react";
import Header from "@/components/Header";
import QuestionGenerator from "@/components/QuestionGenerator";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, BookOpen, BookCopy, ScrollText, GraduationCap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      
      <main className="container pt-28 pb-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <section className="mb-8">
              <h2 className="text-3xl font-semibold tracking-tight mb-2 animate-fade-in">
                Seu assistente para concursos públicos
              </h2>
              <p className="text-muted-foreground mb-8 animate-fade-in-up">
                QuestGenius gera questões personalizadas baseadas em editais anteriores, com explicações detalhadas para maximizar seu aprendizado.
              </p>
              
              <QuestionGenerator />
            </section>
          </div>
          
          <div className="space-y-6">
            <Card className="overflow-hidden border border-border/30 shadow-sm glass-morphism animate-fade-in">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <GraduationCap size={20} className="text-primary" />
                  Benefícios
                </h3>
                
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 p-1 rounded-full mt-0.5">
                      <BookOpen size={14} className="text-primary" />
                    </span>
                    <span>Questões personalizadas com base no edital do concurso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 p-1 rounded-full mt-0.5">
                      <BookCopy size={14} className="text-primary" />
                    </span>
                    <span>Explicações detalhadas para cada questão</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 p-1 rounded-full mt-0.5">
                      <ScrollText size={14} className="text-primary" />
                    </span>
                    <span>Conteúdo atualizado com as legislações mais recentes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 p-1 rounded-full mt-0.5">
                      <Brain size={14} className="text-primary" />
                    </span>
                    <span>Inteligência artificial especializada em concursos</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border border-border/30 shadow-sm glass-morphism animate-fade-in">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Como utilizar</h3>
                <ol className="space-y-3 text-sm list-decimal pl-5">
                  <li>Informe para qual concurso deseja estudar</li>
                  <li>Escolha o nível de dificuldade das questões</li>
                  <li>Responda as questões geradas</li>
                  <li>Analise as explicações detalhadas</li>
                  <li>Continue praticando com novas questões</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-border/40 py-6 text-center text-sm text-muted-foreground">
        <div className="container">
          <p>© 2023 QuestGenius • Assistente especializado para concursos públicos</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
