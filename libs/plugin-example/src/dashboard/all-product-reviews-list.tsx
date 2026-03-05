import { ListPage, DetailPageButton } from '@vendure/dashboard';
import { graphql } from '@/gql';
import { StarRating } from './components/star-rating';
import { ReviewStateLabel } from './components/review-state-label';

const allReviewsListDocument = graphql(`
  query GetAllReviewsList($options: ProductReviewListOptions) {
    productReviews(options: $options) {
      items {
        id
        createdAt
        updatedAt
        summary
        body
        rating
        state
        authorName
        authorLocation
        upvotes
        downvotes
        product {
          id
          name
          featuredAsset {
            id
            preview
          }
        }
      }
      totalItems
    }
  }
`);

export function AllProductReviewsList({ route }: { route: any }) {
  return (
    <ListPage
      pageId="all-product-reviews-list"
      title="Product Reviews"
      route={route}
      listQuery={allReviewsListDocument}
      onSearchTermChange={term => ({
        authorName: { contains: term },
      })}
      customizeColumns={{
        summary: {
          header: 'Summary',
          meta: { dependencies: ['product'] },
          cell: ({ row }) => (
            <DetailPageButton id={row.original.id} label={row.original.summary} />
          ),
        },
        state: {
          header: 'State',
          cell: ({ row }) => <ReviewStateLabel state={row.original.state} />,
        },
        rating: {
          header: 'Rating',
          cell: ({ row }) => <StarRating rating={row.original.rating} showLabel={false} />,
        },
        product: {
          header: 'Product',
          cell: ({ row }) => (
            <span>{row.original.product?.name}</span>
          ),
        },
      }}
      defaultColumnOrder={[
        'id',
        'createdAt',
        'product',
        'summary',
        'state',
        'rating',
        'authorName',
        'authorLocation',
      ]}
      defaultVisibility={{
        updatedAt: false,
        body: false,
        upvotes: false,
        downvotes: false,
      }}
      defaultSort={[{ id: 'createdAt', desc: true }]}
    />
  );
}
