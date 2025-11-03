import { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Card } from './ui/card';
import { Sparkles } from 'lucide-react';

interface PersonalizationOption {
  type: 'text' | 'textarea' | 'checkbox' | 'select';
  label: string;
  placeholder?: string;
  maxLength?: number;
  options?: string[];
  required?: boolean;
}

interface ProductPersonalizationProps {
  options: PersonalizationOption[];
  onChange: (personalization: Record<string, any>) => void;
}

export function ProductPersonalization({ options, onChange }: ProductPersonalizationProps) {
  const [values, setValues] = useState<Record<string, any>>({});

  const handleChange = (label: string, value: any) => {
    const newValues = { ...values, [label]: value };
    setValues(newValues);
    onChange(newValues);
  };

  if (!options || options.length === 0) return null;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Personalize Your Item</h3>
      </div>

      <div className="space-y-4">
        {options.map((option, index) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={`personalization-${index}`}>
              {option.label}
              {option.required && <span className="text-destructive ml-1">*</span>}
            </Label>

            {option.type === 'text' && (
              <Input
                id={`personalization-${index}`}
                placeholder={option.placeholder}
                maxLength={option.maxLength}
                value={values[option.label] || ''}
                onChange={(e) => handleChange(option.label, e.target.value)}
              />
            )}

            {option.type === 'textarea' && (
              <Textarea
                id={`personalization-${index}`}
                placeholder={option.placeholder}
                maxLength={option.maxLength}
                value={values[option.label] || ''}
                onChange={(e) => handleChange(option.label, e.target.value)}
                rows={3}
              />
            )}

            {option.type === 'checkbox' && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`personalization-${index}`}
                  checked={values[option.label] || false}
                  onCheckedChange={(checked) => handleChange(option.label, checked)}
                />
                <label
                  htmlFor={`personalization-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </label>
              </div>
            )}

            {option.type === 'select' && option.options && (
              <select
                id={`personalization-${index}`}
                value={values[option.label] || ''}
                onChange={(e) => handleChange(option.label, e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select an option</option>
                {option.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}

            {option.maxLength && (
              <p className="text-xs text-muted-foreground">
                {(values[option.label]?.length || 0)}/{option.maxLength} characters
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="bg-muted/50 p-3 rounded-lg">
        <p className="text-xs text-muted-foreground">
          💡 Personalized items may take 2-3 additional business days to process.
        </p>
      </div>
    </Card>
  );
}