import { useState, useCallback } from 'react';

interface UseFormReturn<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleBlur: (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  setValues: (values: T) => void;
  setErrors: (errors: Record<string, string>) => void;
  resetForm: () => void;
}

export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void>,
  validate?: (values: T) => Record<string, string>
): UseFormReturn<T> & {
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
} => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));
      if (touched[name]) {
        const fieldError = validate?.({ ...values, [name]: value })[name] || '';
        setErrors((prev) => ({
          ...prev,
          [name]: fieldError,
        }));
      }
    },
    [values, touched, validate]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      if (validate) {
        const fieldError = validate(values)[name] || '';
        setErrors((prev) => ({
          ...prev,
          [name]: fieldError,
        }));
      }
    },
    [values, validate]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (validate) {
        const newErrors = validate(values);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
      }
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setValues,
    setErrors,
    resetForm,
    handleSubmit,
    isSubmitting,
  };
};