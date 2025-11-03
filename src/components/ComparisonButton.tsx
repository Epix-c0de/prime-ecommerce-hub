import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { GitCompare } from 'lucide-react';
import { useComparison } from '@/hooks/useComparison';

interface ComparisonButtonProps {
  onClick: () => void;
}

export function ComparisonButton({ onClick }: ComparisonButtonProps) {
  const { compareCount } = useComparison();

  if (compareCount === 0) return null;

  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="fixed bottom-24 right-6 z-40 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      size="lg"
    >
      <div className="relative">
        <GitCompare className="h-5 w-5 mr-2" />
        Compare
        {compareCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary"
          >
            {compareCount}
          </Badge>
        )}
      </div>
    </Button>
  );
}
