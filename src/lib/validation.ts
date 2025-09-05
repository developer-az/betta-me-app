// Form validation utilities for Betta Me app

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateField = (value: any, rules: ValidationRule): string | null => {
  // Required validation
  if (rules.required && (value === null || value === undefined || value === '')) {
    return 'This field is required';
  }

  // Skip other validations if value is empty and not required
  if (!rules.required && (value === null || value === undefined || value === '')) {
    return null;
  }

  // String length validation
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`;
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Must be no more than ${rules.maxLength} characters`;
    }
  }

  // Numeric validation
  if (typeof value === 'number' || !isNaN(Number(value))) {
    const numValue = Number(value);
    if (rules.min !== undefined && numValue < rules.min) {
      return `Must be at least ${rules.min}`;
    }
    if (rules.max !== undefined && numValue > rules.max) {
      return `Must be no more than ${rules.max}`;
    }
  }

  // Pattern validation
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    return 'Invalid format';
  }

  // Custom validation
  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
};

export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, ValidationRule>
): ValidationResult => {
  const errors: Record<string, string> = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const error = validateField(data[field], fieldRules);
    if (error) {
      errors[field] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Sanitization utilities
export const sanitizeString = (value: string): string => {
  return value.trim().replace(/[<>]/g, '');
};

export const sanitizeNumber = (value: string | number): number => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
};

// Specific validation rules for Betta Me app
export const fishValidationRules = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 50,
    custom: (value: string) => {
      if (!/^[a-zA-Z0-9\s'-]+$/.test(value)) {
        return 'Name can only contain letters, numbers, spaces, hyphens, and apostrophes';
      }
      return null;
    }
  },
  color: {
    required: true,
    pattern: /^#[0-9A-Fa-f]{6}$/,
    custom: (value: string) => {
      if (!value.startsWith('#')) {
        return 'Color must be in hex format (e.g., #ff0000)';
      }
      return null;
    }
  }
};

export const waterValidationRules = {
  temperature: {
    required: true,
    min: 65,
    max: 90,
    custom: (value: number) => {
      if (value < 75 || value > 82) {
        return 'Recommended range is 75-82°F for betta fish';
      }
      return null;
    }
  },
  pH: {
    required: true,
    min: 5.0,
    max: 9.0,
    custom: (value: number) => {
      if (value < 6.5 || value > 7.5) {
        return 'Recommended range is 6.5-7.5 pH for betta fish';
      }
      return null;
    }
  },
  ammonia: {
    required: true,
    min: 0,
    max: 10,
    custom: (value: number) => {
      if (value > 0) {
        return 'Ammonia should be 0 ppm - dangerous levels detected!';
      }
      return null;
    }
  },
  nitrite: {
    required: true,
    min: 0,
    max: 10,
    custom: (value: number) => {
      if (value > 0) {
        return 'Nitrite should be 0 ppm - toxic levels detected!';
      }
      return null;
    }
  },
  nitrate: {
    required: true,
    min: 0,
    max: 100,
    custom: (value: number) => {
      if (value > 20) {
        return 'Nitrate should be below 20 ppm for optimal health';
      }
      return null;
    }
  }
};

export const tankValidationRules = {
  size: {
    required: true,
    min: 2.5,
    max: 500,
    custom: (value: number) => {
      if (value < 5) {
        return 'Recommended minimum tank size is 5 gallons for betta fish';
      }
      return null;
    }
  }
};