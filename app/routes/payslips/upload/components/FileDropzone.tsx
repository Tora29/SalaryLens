import { useState, useRef, useCallback, type RefObject } from "react";
import { Upload, FileText, X } from "lucide-react";
import { ALLOWED_FILE_TYPES } from "../schema";

type FileDropzoneState = {
  dragActive: boolean;
  selectedFile: File | null;
  previewUrl: string | null;
};

type UseFileDropzoneReturn = FileDropzoneState & {
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearFile: () => void;
};

/**
 * ファイルドロップゾーンのカスタムフック
 */
export function useFileDropzone(): UseFileDropzoneReturn {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ファイル選択処理
  const handleFileSelect = useCallback((file: File) => {
    if (
      !ALLOWED_FILE_TYPES.includes(
        file.type as (typeof ALLOWED_FILE_TYPES)[number]
      )
    ) {
      // サーバーサイドバリデーションに任せる
      return;
    }

    setSelectedFile(file);

    // 画像の場合はプレビューを表示
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }, []);

  // ドラッグイベントハンドラ
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // ドロップイベントハンドラ
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  // ファイル入力変更ハンドラ
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  // ファイル選択をクリア
  const clearFile = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previewUrl]);

  return {
    dragActive,
    selectedFile,
    previewUrl,
    fileInputRef,
    handleDrag,
    handleDrop,
    handleInputChange,
    clearFile,
  };
}

type Props = {
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
 * ファイルドラッグ&ドロップエリア
 * 画像のプレビュー表示に対応
 */
export function FileDropzone({
  dragActive,
  selectedFile,
  previewUrl,
  fileInputRef,
  onDrag,
  onDrop,
  onInputChange,
  onClearFile,
}: Props) {
  return (
    <div
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`
        relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors
        ${
          dragActive
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
            : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        name="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={onInputChange}
        className="sr-only"
      />

      {selectedFile ? (
        <div className="space-y-4">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="プレビュー"
              className="max-h-48 mx-auto rounded-xl"
            />
          ) : (
            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
            <FileText className="w-4 h-4" />
            <span className="text-sm">{selectedFile.name}</span>
            {/* M3 Icon Button - 最小タッチターゲット 48x48 */}
            <button
              type="button"
              aria-label="ファイル選択をクリア"
              onClick={(e) => {
                e.stopPropagation();
                onClearFile();
              }}
              className="min-w-12 min-h-12 p-3 hover:bg-gray-900/8 dark:hover:bg-white/8 active:bg-gray-900/12 dark:active:bg-white/12 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-base text-gray-700 dark:text-gray-300 mb-2">
            ファイルをドラッグ&ドロップ
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            または クリックしてファイルを選択
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
            対応形式: PDF, PNG, JPG
          </p>
        </>
      )}
    </div>
  );
}
