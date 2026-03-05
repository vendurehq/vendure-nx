import { defineDashboardExtension } from '@vendure/dashboard';
import { AllProductReviewsList } from './all-product-reviews-list';
import { ProductReviewDetail } from './components/product-review-detail';
import { ReviewsWidget } from './components/reviews-widget';
import { StarRatingFormInput } from './components/star-rating';
import { ReviewCountLink } from './components/review-count-link';
import { FeaturedReviewSelector } from './components/featured-review-selector';

export default defineDashboardExtension({
  routes: [
    {
      path: '/product-reviews',
      component: route => <AllProductReviewsList route={route} />,
      navMenuItem: {
        id: 'product-reviews',
        title: 'Product reviews',
        sectionId: 'marketing',
      },
    },
    {
      path: '/product-reviews/$id',
      component: () => <ProductReviewDetail />,
    },
  ],
  widgets: [
    {
      id: 'reviews-widget',
      name: 'Latest reviews',
      component: ReviewsWidget,
      defaultSize: { w: 6, h: 4 },
      minSize: { w: 4, h: 3 },
    },
  ],
  customFormComponents: {
    customFields: [
      {
        id: 'star-rating-form-input',
        component: StarRatingFormInput,
      },
      {
        id: 'review-count-link',
        component: ReviewCountLink,
      },
      {
        id: 'review-selector-form-input',
        component: FeaturedReviewSelector,
      },
    ],
  },
});
