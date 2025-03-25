
import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: number;
  className?: string;
  text?: string;
}

const Loader = ({ size = 24, className = "", text }: LoaderProps) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 
        className="animate-spin text-primary" 
        size={size} 
      />
      {text && (
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
};

export default Loader;
