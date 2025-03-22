
import React from "react";
import { Brain } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 border-b border-border/40 backdrop-blur-md bg-background/80 fixed top-0 z-10">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={28} className="text-primary" />
          <div>
            <h1 className="text-xl font-semibold tracking-tight">QuestGenius</h1>
            <p className="text-xs text-muted-foreground">Assistente para Concursos Públicos</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
