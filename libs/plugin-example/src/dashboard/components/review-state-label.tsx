import { Badge } from '@vendure/dashboard';

type ReviewState = 'new' | 'approved' | 'rejected';

const stateConfig: Record<ReviewState, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  new: { label: 'New', variant: 'outline' },
  approved: { label: 'Approved', variant: 'default' },
  rejected: { label: 'Rejected', variant: 'destructive' },
};

export function ReviewStateLabel({ state }: { state: string }) {
  const config = stateConfig[state as ReviewState] ?? stateConfig.new;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
