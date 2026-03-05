import { Star, StarHalf } from 'lucide-react';
import { type DashboardFormComponent } from '@vendure/dashboard';

export function StarRating({ rating, showLabel = true }: { rating: number; showLabel?: boolean }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />);
    } else if (rating >= i - 0.5) {
      stars.push(<StarHalf key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />);
    } else {
      stars.push(<Star key={i} className="h-4 w-4 text-muted-foreground" />);
    }
  }
  return (
    <div className="flex items-center gap-0.5">
      {stars}
      {showLabel && <span className="ml-1 text-sm text-muted-foreground">{rating}/5</span>}
    </div>
  );
}

export const StarRatingFormInput: DashboardFormComponent = ({ value }) => {
  return <StarRating rating={value ?? 0} />;
};
