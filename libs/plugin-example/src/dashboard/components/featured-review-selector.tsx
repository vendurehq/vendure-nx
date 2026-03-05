import { useQuery } from '@tanstack/react-query';
import { api, usePage, type DashboardFormComponent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@vendure/dashboard';
import { graphql } from '@/gql';

const getReviewsForProductDocument = graphql(`
  query GetReviewsForProduct($productId: ID!) {
    product(id: $productId) {
      id
      reviews {
        items {
          id
          summary
          rating
        }
        totalItems
      }
    }
  }
`);

export const FeaturedReviewSelector: DashboardFormComponent = ({ value, onChange }) => {
  const page = usePage();
  const entityId = page.entity?.id;

  const { data } = useQuery({
    queryKey: ['FeaturedReviewSelector', entityId],
    queryFn: () => api.query(getReviewsForProductDocument, { productId: entityId }),
    enabled: !!entityId,
  });

  const reviews = data?.product?.reviews?.items ?? [];
  const selectedId = value?.id ?? '';

  return (
    <Select
      value={selectedId}
      onValueChange={val => {
        const selected = reviews.find(r => r.id === val);
        onChange(selected ?? null);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a review..." />
      </SelectTrigger>
      <SelectContent>
        {reviews.map(review => (
          <SelectItem key={review.id} value={review.id}>
            {review.summary} ({review.rating}/5)
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
