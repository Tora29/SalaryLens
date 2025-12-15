// React・ライブラリ
import { Form, Link } from "react-router";
import { Loader2 } from "lucide-react";

// 型定義
import type { PayslipFormData } from "../schema";
import type { ConfirmationFormProps } from "./types";

// ローカルスキーマ
import { PAYSLIP_FIELDS } from "../schema";

// 共有コンポーネント
import { ErrorMessage } from "~/shared/components/ErrorMessage";
import { FormSection } from "~/shared/components/FormSection";
import { InputField } from "~/shared/components/InputField";

/**
 * 給与明細の確認・編集フォーム
 * アップロード後のOCR結果を確認・修正して保存する
 */
export function ConfirmationForm({
  data,
  fileName,
  isSubmitting,
  actionData,
}: ConfirmationFormProps) {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            内容の確認・修正
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            アップロードされたファイル: {fileName}
          </p>
        </div>

        <Form method="post">
          <input type="hidden" name="intent" value="save" />

          <div className="space-y-6">
            {/* 基本情報 */}
            <FormSection title="基本情報">
              <div className="grid grid-cols-2 gap-4">
                <InputField id="year" label="年" defaultValue={data.year} />
                <InputField id="month" label="月" defaultValue={data.month} />
              </div>
            </FormSection>

            {/* 勤怠 */}
            <FormSection title="勤怠">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PAYSLIP_FIELDS.attendance.map((field) => (
                  <InputField
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    defaultValue={data[field.id as keyof PayslipFormData]}
                    suffix={field.suffix}
                    type={field.inputType === "time" ? "text" : "number"}
                  />
                ))}
              </div>
            </FormSection>

            {/* 支給 */}
            <FormSection title="支給">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PAYSLIP_FIELDS.earnings.map((field) => (
                  <InputField
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    defaultValue={data[field.id as keyof PayslipFormData]}
                    suffix={field.suffix}
                    type="text"
                  />
                ))}
              </div>
            </FormSection>

            {/* 控除 */}
            <FormSection title="控除">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PAYSLIP_FIELDS.deductions.map((field) => (
                  <InputField
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    defaultValue={data[field.id as keyof PayslipFormData]}
                    suffix={field.suffix}
                    type="text"
                  />
                ))}
              </div>
            </FormSection>

            {/* 差引支給額 */}
            <FormSection title="差引支給額">
              <div className="max-w-xs">
                <InputField
                  id="netSalary"
                  label="差引支給額"
                  defaultValue={data.netSalary}
                  suffix="円"
                  type="text"
                />
              </div>
            </FormSection>

            {/* エラー表示 */}
            {actionData && "error" in actionData && (
              <ErrorMessage message={actionData.error} />
            )}

            {/* ボタン */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 min-h-12 px-6 py-2.5 bg-indigo-600 hover:shadow-md active:shadow-none disabled:opacity-[0.38] disabled:shadow-none text-white rounded-full text-sm font-medium tracking-wide transition-shadow flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    保存中...
                  </>
                ) : (
                  "保存"
                )}
              </button>
              <Link
                to="/payslips/upload"
                className="min-h-12 px-4 py-2.5 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium tracking-wide hover:bg-indigo-600/8 active:bg-indigo-600/12 transition-colors flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
              >
                キャンセル
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </main>
  );
}
