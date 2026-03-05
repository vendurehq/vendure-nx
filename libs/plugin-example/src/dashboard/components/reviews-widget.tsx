import { useQuery } from '@tanstack/react-query';
import {
  api,
  DashboardBaseWidget,
  type DashboardBaseWidgetProps,
  DetailPageButton,
} from '@vendure/dashboard';
import { graphql } from '@/gql';
import { StarRating } from './star-rating';
import { ReviewStateLabel } from './review-state-label';

const reviewsForWidgetDocument = graphql(`
  query GetReviewsForWidget($options: ProductReviewListOptions) {
    productReviews(options: $options) {
      items {
        id
        authorName
        summary
        rating
        state
        createdAt
        product {
          id
          name
        }
      }
      totalItems
    }
  }
`);

export function ReviewsWidget(props: DashboardBaseWidgetProps) {
  const { data } = useQuery({
    queryKey: ['ReviewsWidget'],
    queryFn: () =>
      api.query(reviewsForWidgetDocument, {
        options: {
          filter: { state: { eq: 'new' } },
          take: 10,
        },
      }),
  });

  const reviews = data?.productReviews?.items ?? [];

  return (
    <DashboardBaseWidget {...props} title="Latest reviews">
      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No pending reviews</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium">Date</th>
                <th className="text-left py-2 font-medium">Product</th>
                <th className="text-left py-2 font-medium">Summary</th>
                <th className="text-left py-2 font-medium">Author</th>
                <th className="text-left py-2 font-medium">Rating</th>
                <th className="text-left py-2 font-medium">State</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review.id} className="border-b last:border-0">
                  <td className="py-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2">{review.product.name}</td>
                  <td className="py-2">
                    <DetailPageButton
                      href={`/extensions/product-reviews/${review.id}`}
                      label={review.summary}
                    />
                  </td>
                  <td className="py-2">{review.authorName}</td>
                  <td className="py-2">
                    <StarRating rating={review.rating} showLabel={false} />
                  </td>
                  <td className="py-2">
                    <ReviewStateLabel state={review.state} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardBaseWidget>
  );
}
