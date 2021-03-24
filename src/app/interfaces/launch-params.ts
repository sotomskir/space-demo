export interface LaunchParams {
  offset?: number;
  nextPage?: boolean;
  limit?: number;
  format?: string;
  ordering?: string;
  mode?: string;
  search?: string;
  name?: string;
  location__ids?: number[];
}
