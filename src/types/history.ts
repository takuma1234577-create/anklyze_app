export type SquatStyle = "high-bar" | "low-bar" | "front-squat";

export type HistoryRecord = {
  id: string;
  date: string;
  leftAngle: number | null;
  rightAngle: number | null;
  difference: number | null;
  squatStyle: SquatStyle;
  createdAtMs: number;
};

export type SaveHistoryInput = Omit<HistoryRecord, "id">;
