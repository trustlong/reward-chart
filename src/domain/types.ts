export type Chart = {
  id: string;
  childName: string;
  startDate: string;
  goal: string;
  rules: string[];
  scale: number;
  milestones: (number | null)[];
  completedSteps: number[];
  createdAt: string;
  updatedAt: string;
};

export type ChartStore = {
  schemaVersion: 1;
  charts: Chart[];
  activeChartId: string | null;
};
