export * from './ingredient';
export * from './recipe';
export * from './suggestion';

export interface ApiError {
  detail: string;
  status_code?: number;
}
