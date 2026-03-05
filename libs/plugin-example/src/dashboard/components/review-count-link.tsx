import { type DashboardFormComponent } from '@vendure/dashboard';

export const ReviewCountLink: DashboardFormComponent = ({ value }) => {
  return <span className="text-sm">{value ?? 0}</span>;
};
