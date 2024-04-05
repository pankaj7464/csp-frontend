export interface ProjectBudget {
    id: string;
    type: string;
    durationInMonths?: number;
    contractDuration?: number;
    budgetedHours?: number;
    budgetedCost: number;
    currency: string;
    projectId: string;
  }