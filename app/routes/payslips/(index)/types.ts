// 型定義
import type { ExportRangeType, SalaryRecord } from "./schema";

/** PageHeader コンポーネントの Props */
export type PageHeaderProps = {
  recordsCount: number;
  selectedYear: number | "all";
  availableYears: number[];
  onYearChange: (value: string) => void;
  onExportClick: () => void;
};

/** PayslipsTable コンポーネントの Props */
export type PayslipsTableProps = {
  records: SalaryRecord[];
  isAllYears: boolean;
  onRecordClick: (record: SalaryRecord) => void;
};

/** PayslipDetailModal コンポーネントの Props */
export type PayslipDetailModalProps = {
  record: SalaryRecord;
  onClose: () => void;
};

/** ExportModal コンポーネントの Props */
export type ExportModalProps = {
  isAllYears: boolean;
  selectedYear: number | "all";
  records: SalaryRecord[];
  onClose: () => void;
};

/** ExportModal の内部状態 */
export type ExportState = {
  rangeType: ExportRangeType;
  year: number | undefined;
  month: number | undefined;
};
