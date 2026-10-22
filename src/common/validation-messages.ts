export const VALIDATION_MESSAGES = {
  isString: 'Le champ $property doit être une chaîne de caractères.',
  isEnum: 'La valeur du champ $property est invalide.',
  isNotEmpty: 'Le champ $property est obligatoire.',
  minLength: 'Le champ $property doit contenir au moins $constraint1 caractères.',
  maxLength: 'Le champ $property ne doit pas dépasser $constraint1 caractères.',
} as const;
