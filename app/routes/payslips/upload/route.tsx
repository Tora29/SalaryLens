// React・ライブラリ
import { Form, useActionData, useNavigation } from "react-router";
import { Loader2, Upload } from "lucide-react";

// 型定義
import type { Route } from "./+types/route";
import type { ActionData } from "./schema";

// サーバー・ロジック
import { handleFileUpload, handleSavePayslip } from "./server";

// 共有コンポーネント
import { ErrorMessage } from "~/shared/components/ErrorMessage";

// ローカルコンポーネント
import { ConfirmationForm } from "./components/ConfirmationForm";
import { FileDropzone, useFileDropzone } from "./components/FileDropzone";
import { SuccessCard } from "./components/SuccessCard";

export async function action({
  request,
}: Route.ActionArgs): Promise<ActionData> {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "upload") {
    const file = formData.get("file") as File | null;
    return handleFileUpload(file);
  }

  if (intent === "save") {
    return handleSavePayslip(formData);
  }

  return { success: false, error: "不正なリクエストです" };
}

export default function PayslipUpload(_props: Route.ComponentProps) {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const {
    dragActive,
    selectedFile,
    previewUrl,
    fileInputRef,
    handleDrag,
    handleDrop,
    handleInputChange,
    clearFile,
  } = useFileDropzone();

  // 確認画面を表示するか
  const showConfirmation =
    actionData && "step" in actionData && actionData.step === "confirm";

  // 保存成功時
  const showSuccess =
    actionData && "success" in actionData && actionData.success;

  // 保存成功画面
  if (showSuccess) {
    return <SuccessCard message={actionData.message} />;
  }

  // 確認・編集画面
  if (showConfirmation) {
    return (
      <ConfirmationForm
        data={actionData.data}
        fileName={actionData.fileName}
        isSubmitting={isSubmitting}
        actionData={actionData}
      />
    );
  }

  // アップロード画面
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            給与明細アップロード
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            画像またはPDFファイルをアップロードしてください
          </p>
        </div>

        <Form method="post" encType="multipart/form-data">
          <input type="hidden" name="intent" value="upload" />

          {/* カード */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
            <FileDropzone
              dragActive={dragActive}
              selectedFile={selectedFile}
              previewUrl={previewUrl}
              fileInputRef={fileInputRef}
              onDrag={handleDrag}
              onDrop={handleDrop}
              onInputChange={handleInputChange}
              onClearFile={clearFile}
            />

            {/* エラー表示 */}
            {actionData && "error" in actionData && (
              <div className="mt-4">
                <ErrorMessage message={actionData.error} />
              </div>
            )}

            {/* M3 Filled Button */}
            <button
              type="submit"
              disabled={!selectedFile || isSubmitting}
              className="mt-6 w-full min-h-12 px-6 py-2.5 bg-indigo-600 hover:shadow-md active:shadow-none disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed text-white rounded-full text-sm font-medium tracking-wide transition-shadow flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  アップロード中...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  アップロード
                </>
              )}
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}
