export type RegisterFormErrors = {
  name?: string[];
  password?: string[];
  confirmPassword?: string[];
  phone?: string[];
  policy?: string;
};

export type FoodIntakeFormErrors = {
  description?: string[];
  comment?: string[];
};

export type InsulinInjectionFormErrors = {
  amount?: string[];
  comment?: string[];
};

export type GlucoseMeasurementFormErrors = {
  amount?: string[];
  comment?: string[];
};

export type FoodIntake = {
  id: number;
  user_id: number;
  date: string;
  time: string;
  description: string;
  portion_size: "обычный" | "меньше обычного" | "больше обычного";
  carbs?: number;
  bread_units?: number;
  comment: string;
};

export type InsulinInjection = {
  id: number;
  user_id: number;
  date: string;
  time: string;
  amount: number;
  comment: string;
}

export type GlucoseMeasurement = {
  id: number;
  user_id: number;
  date: string;
  time: string;
  amount: number;
  comment: string;
  high_amount_count: number;
}

export type Action = {
  id: number;
  record_type: string;
  date: string;
  time: string;
  detail: string;
  extra_info?: string|null;
  carbs?: number|null;
  bread_units?: number|null;
  comment?: string;
}

export type DailyRecords = {
  date: string;
  daily_records: Action[];
}