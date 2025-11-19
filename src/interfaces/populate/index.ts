export interface IPopulate {
  path: string; // the field you want to populate, e.g., 'userId'
  select?: string; // optional: fields to include/exclude, e.g., 'name email'
  match?: Record<string, any>; // optional: filter conditions
  options?: object;
}
