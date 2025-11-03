import { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Card } from './ui/card';
import { Sparkles } from 'lucide-react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface PersonalizationOption {
  type: 'text' | 'textarea' | 'checkbox' | 'select' | 'color';
  label: string;
  placeholder?: string;
  maxLength?: number;
  options?: string[] | { name: string; value: string }[];
  required?: boolean;
  price?: number;
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
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Personalize Your Item</h3>
      </div>
      
      {options.some(opt => opt.price) && (
        <p className="text-sm text-muted-foreground mb-4">
          Additional personalization charges may apply
        </p>
      )}

      <div className="space-y-4">
        {options.map((option, index) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={`personalization-${index}`}>
              {option.label}
              {option.required && <span className="text-destructive ml-1">*</span>}
              {option.price && option.price > 0 && (
                <span className="text-sm text-muted-foreground ml-2">
                  (+KSh {option.price.toLocaleString()})
                </span>
              )}
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
              <Select
                value={values[option.label] || ''}
                onValueChange={(value) => handleChange(option.label, value)}
              >
                <SelectTrigger id={`personalization-${index}`}>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {option.options.map((opt) => {
                    const isObject = typeof opt === 'object' && opt !== null;
                    const optValue = isObject ? opt.value : opt;
                    const optLabel = isObject ? opt.name : opt;
                    return (
                      <SelectItem key={optValue} value={optValue}>
                        {optLabel}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}

            {option.type === 'color' && option.options && (
              <div className="grid grid-cols-4 gap-3">
                {option.options.map((color) => {
                  const isObject = typeof color === 'object' && color !== null;
                  const colorValue = isObject ? color.value : color;
                  const colorName = isObject ? color.name : color;
                  const isSelected = values[option.label] === colorValue;
                  
                  return (
                    <button
                      key={colorValue}
                      type="button"
                      onClick={() => handleChange(option.label, colorValue)}
                      className={`relative p-4 rounded-lg border-2 transition-all ${
                        isSelected ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-muted hover:border-primary/50'
                      }`}
                      style={{ backgroundColor: colorValue }}
                      title={colorName}
                    >
                      <span className="sr-only">{colorName}</span>
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
                            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
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