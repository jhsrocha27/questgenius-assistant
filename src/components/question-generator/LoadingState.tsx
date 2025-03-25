
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Gerando questão...</p>
    </div>
  );
};

export default LoadingState;
