/**
 * GenerateReportCommand
 * Command for generating a trading report
 */
export interface GenerateReportCommand {
  userId: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
}

