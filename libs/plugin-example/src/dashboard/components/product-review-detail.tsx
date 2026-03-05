import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { toast } from 'sonner';
import {
  api,
  useDetailPage,
  Page,
  PageLayout,
  PageBlock,
  PageActionBar,
  PageActionBarRight,
  PageTitle,
  DetailFormGrid,
  FormFieldWrapper,
  Button,
  Input,
  Textarea,
} from '@vendure/dashboard';
import { graphql } from '@/gql';
import { StarRating } from './star-rating';
import { ReviewStateLabel } from './review-state-label';

const reviewDetailDocument = graphql(`
  query GetReviewDetail($id: ID!) {
    productReview(id: $id) {
      id
      createdAt
      updatedAt
      authorName
      authorLocation
      summary
      body
      rating
      state
      upvotes
      downvotes
      response
      responseCreatedAt
      product {
        id
        name
        featuredAsset {
          id
          preview
        }
      }
      productVariant {
        id
        name
        featuredAsset {
          id
          preview
        }
      }
    }
  }
`);

const updateReviewDocument = graphql(`
  mutation UpdateReview($input: UpdateProductReviewInput!) {
    updateProductReview(input: $input) {
      id
      createdAt
      updatedAt
      authorName
      authorLocation
      summary
      body
      rating
      state
      upvotes
      downvotes
      response
      responseCreatedAt
      product {
        id
        name
        featuredAsset {
          id
          preview
        }
      }
      productVariant {
        id
        name
        featuredAsset {
          id
          preview
        }
      }
    }
  }
`);

const approveReviewDocument = graphql(`
  mutation ApproveReview($id: ID!) {
    approveProductReview(id: $id) {
      id
      state
      product {
        id
        customFields {
          reviewCount
          reviewRating
        }
      }
    }
  }
`);

const rejectReviewDocument = graphql(`
  mutation RejectReview($id: ID!) {
    rejectProductReview(id: $id) {
      id
      state
    }
  }
`);

export function ProductReviewDetail() {
  const params = useParams({ strict: false }) as { id: string };
  const queryClient = useQueryClient();

  const { form, submitHandler, entity, isPending } = useDetailPage({
    queryDocument: reviewDetailDocument,
    updateDocument: updateReviewDocument,
    params: { id: params.id },
    setValuesForUpdate: entity => ({
      id: entity.id,
      summary: entity.summary,
      body: entity.body,
      response: entity.response,
    }),
    onSuccess: () => {
      toast.success('Review updated');
    },
    onError: () => {
      toast.error('Failed to update review');
    },
  });

  const approveMutation = useMutation({
    mutationFn: () => api.mutate(approveReviewDocument, { id: params.id }),
    onSuccess: () => {
      toast.success('Review approved');
      queryClient.invalidateQueries({ queryKey: ['DetailPage'] });
    },
    onError: () => {
      toast.error('Failed to approve review');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => api.mutate(rejectReviewDocument, { id: params.id }),
    onSuccess: () => {
      toast.success('Review rejected');
      queryClient.invalidateQueries({ queryKey: ['DetailPage'] });
    },
    onError: () => {
      toast.error('Failed to reject review');
    },
  });

  const state = entity?.state ?? '';

  return (
    <Page
      pageId="product-review-detail"
      form={form}
      submitHandler={submitHandler}
      entity={entity}
    >
      <PageTitle>
        Review #{entity?.id} {entity?.product?.name ? `(${entity.product.name})` : ''}
      </PageTitle>
      <PageActionBar>
        <div className="flex items-center gap-2">
          <ReviewStateLabel state={state} />
        </div>
        <PageActionBarRight>
          {state === 'new' ? (
            <>
              <Button
                type="button"
                variant="default"
                onClick={() => {
                  submitHandler({ preventDefault: () => {} } as any);
                  approveMutation.mutate();
                }}
                disabled={isPending || approveMutation.isPending}
              >
                Approve
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  submitHandler({ preventDefault: () => {} } as any);
                  rejectMutation.mutate();
                }}
                disabled={isPending || rejectMutation.isPending}
              >
                Reject
              </Button>
            </>
          ) : (
            <Button type="submit" disabled={isPending}>
              Update
            </Button>
          )}
        </PageActionBarRight>
      </PageActionBar>
      <PageLayout>
        <PageBlock column="main" blockId="review-form">
          <DetailFormGrid>
            <FormFieldWrapper
              control={form.control}
              name="summary"
              label="Summary"
              render={({ field }) => <Input {...field} />}
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Rating</label>
              <StarRating rating={entity?.rating ?? 0} />
            </div>
            <div className="col-span-full">
              <FormFieldWrapper
                control={form.control}
                name="body"
                label="Body"
                render={({ field }) => <Textarea {...field} rows={4} />}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Author name</label>
              <p className="mt-1">{entity?.authorName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Author location</label>
              <p className="mt-1">{entity?.authorLocation}</p>
            </div>
            <div className="col-span-full">
              <FormFieldWrapper
                control={form.control}
                name="response"
                label="Response"
                render={({ field }) => <Textarea {...field} value={field.value ?? ''} rows={3} />}
              />
            </div>
          </DetailFormGrid>
        </PageBlock>
        <PageBlock column="side" blockId="review-product" title="Product">
          {entity?.product?.featuredAsset && (
            <img
              src={entity.product.featuredAsset.preview + '?preset=small'}
              alt={entity.product.name}
              className="w-full rounded-md mb-2"
            />
          )}
          {entity?.product && (
            <p className="text-sm">{entity.product.name}</p>
          )}
        </PageBlock>
        <PageBlock column="side" blockId="review-info" title="Info">
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">ID: </span>
              <span>{entity?.id}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Created: </span>
              <span>{entity?.createdAt ? new Date(entity.createdAt).toLocaleDateString() : ''}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Updated: </span>
              <span>{entity?.updatedAt ? new Date(entity.updatedAt).toLocaleDateString() : ''}</span>
            </div>
          </div>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
