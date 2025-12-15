// 型定義
import type { RefObject } from "react";
import type { ActionData, PayslipFormData } from "../schema";

/**
 * ConfirmationForm コンポーネントの Props
 */
export type ConfirmationFormProps = {
  data: PayslipFormData;
  fileName: string;
  isSubmitting: boolean;
  actionData: ActionData;
};

/**
 * FileDropzone コンポーネントの Props
 */
export type FileDropzoneProps = {
  dragActive: boolean;
  selectedFile: File | null;
  previewUrl: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFile: () => void;
};

/**
 * SuccessCard コンポーネントの Props
 */
export type SuccessCardProps = {
  message: string;
};
