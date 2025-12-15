// 型定義
import type { PayslipDetailModalProps } from "./types";

// 共有コンポーネント
import { Modal } from "~/shared/components/Modal";
import {
  formatCurrency,
  formatMinutesToHoursAndMinutes,
} from "~/shared/utils/format";

// ローカルコンポーネント
import { DetailItem } from "./detail/DetailItem";
import { DetailRow } from "./detail/DetailRow";

/**
 * 給与明細詳細モーダル
 * 勤怠情報、支給、控除、差引支給額を表示
 */
export function PayslipDetailModal({
  record,
  onClose,
}: PayslipDetailModalProps) {
  return (
    <Modal
      title={`${record.year}年${record.month}月の給与明細`}
      onClose={onClose}
    >
      <div className="space-y-6">
        {/* 勤怠情報 */}
        <section>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            勤怠情報
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <DetailItem
              label="固定外残業時間"
              value={formatMinutesToHoursAndMinutes(
                record.extraOvertimeMinutes
              )}
            />
            <DetailItem
              label="60h超残業時間"
              value={formatMinutesToHoursAndMinutes(
                record.over60OvertimeMinutes
              )}
            />
            <DetailItem
              label="深夜割増時間"
              value={formatMinutesToHoursAndMinutes(
                record.nightOvertimeMinutes
              )}
            />
            <DetailItem
              label="有休"
              value={`使用 ${record.paidLeaveDays}日 / 残 ${record.paidLeaveRemainingDays}日`}
            />
          </div>
        </section>

        {/* 支給 */}
        <section>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            支給
          </h3>
          <div className="space-y-2">
            <DetailRow
              label="基本給"
              value={formatCurrency(record.baseSalary)}
            />
            <DetailRow
              label="固定時間外手当"
              value={formatCurrency(record.fixedOvertimeAllowance)}
            />
            <DetailRow
              label="残業手当"
              value={formatCurrency(record.overtimeAllowance)}
            />
            <DetailRow
              label="残業手当(60h超)"
              value={formatCurrency(record.over60OvertimeAllowance)}
            />
            <DetailRow
              label="深夜割増額"
              value={formatCurrency(record.nightAllowance)}
            />
            <DetailRow
              label="特別手当"
              value={formatCurrency(record.specialAllowance)}
            />
            <DetailRow
              label="立替経費"
              value={formatCurrency(record.expenseReimbursement)}
            />
            <DetailRow
              label="非課税通勤費"
              value={formatCurrency(record.commuteAllowance)}
            />
            <DetailRow
              label="持株会奨励金"
              value={formatCurrency(record.stockIncentive)}
            />
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <DetailRow
                label="支給合計"
                value={formatCurrency(record.totalEarnings)}
                highlight
              />
            </div>
          </div>
        </section>

        {/* 控除 */}
        <section>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            控除
          </h3>
          <div className="space-y-2">
            <DetailRow
              label="健康保険料"
              value={formatCurrency(record.healthInsurance)}
            />
            <DetailRow
              label="厚生年金保険"
              value={formatCurrency(record.pensionInsurance)}
            />
            <DetailRow
              label="雇用保険料"
              value={formatCurrency(record.employmentInsurance)}
            />
            <DetailRow
              label="住民税"
              value={formatCurrency(record.residentTax)}
            />
            <DetailRow
              label="所得税"
              value={formatCurrency(record.incomeTax)}
            />
            <DetailRow
              label="持株会拠出金"
              value={formatCurrency(record.stockContribution)}
            />
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <DetailRow
                label="控除合計"
                value={formatCurrency(record.totalDeductions)}
                highlight
              />
            </div>
          </div>
        </section>

        {/* 差引支給額 */}
        <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-base font-medium text-gray-700 dark:text-gray-300">
              差引支給額
            </span>
            <span className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(record.netSalary)}
            </span>
          </div>
        </section>
      </div>
    </Modal>
  );
}
