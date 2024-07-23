/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FieldProps {
  // form: UseFormReturn<z.infer<typeof formSchema>>;
  form: any;
  label: string;
  hidden?: boolean;
  name: string;
  description?: string;
  error?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  options?: string[];
  defaultValue?: string;
  data?: any[];
  onChange?: (e: any) => void;
}
