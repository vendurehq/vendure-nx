import { Inject } from '@nestjs/common';
import { LanguageCode, PluginCommonModule, VendurePlugin } from '@vendure/core';

import { EXAMPLE_PLUGIN_OPTIONS } from './constants';
import { ExamplePluginInitOptions } from './types';
import { ProductReview } from './entities/product-review.entity';
import { adminApiExtensions, shopApiExtensions } from './api/api-extensions';
import { ProductEntityResolver } from './api/product-entity.resolver';
import { ProductReviewAdminResolver } from './api/product-review-admin.resolver';
import { ProductReviewEntityResolver } from './api/product-review-entity.resolver';
import { ProductReviewShopResolver } from './api/product-review-shop.resolver';

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [ProductReview],
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [ProductEntityResolver, ProductReviewAdminResolver, ProductReviewEntityResolver],
  },
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [ProductEntityResolver, ProductReviewShopResolver, ProductReviewEntityResolver],
  },
  providers: [
    {
      provide: EXAMPLE_PLUGIN_OPTIONS,
      useFactory: () => ExamplePlugin.options,
    },
  ],
  configuration: (config) => {
    // Add configuration here
    config.customFields.Product.push({
      name: 'reviewRating',
      label: [{ languageCode: LanguageCode.en, value: 'Review rating' }],
      public: true,
      nullable: true,
      type: 'float',
      ui: { tab: 'Reviews', component: 'star-rating-form-input' },
    });
    config.customFields.Product.push({
      name: 'reviewCount',
      label: [{ languageCode: LanguageCode.en, value: 'Review count' }],
      public: true,
      defaultValue: 0,
      type: 'float',
      ui: { tab: 'Reviews', component: 'review-count-link' },
    });
    config.customFields.Product.push({
      name: 'featuredReview',
      label: [{ languageCode: LanguageCode.en, value: 'Featured review' }],
      public: true,
      type: 'relation',
      entity: ProductReview,
      ui: { tab: 'Reviews', component: 'review-selector-form-input' },
    });
    return config;
  },
  dashboard: '../dashboard/index.tsx',
  compatibility: '^3.0.0',
})
export class ExamplePlugin {
  static options: ExamplePluginInitOptions = {};

  static init(options: ExamplePluginInitOptions) {
    this.options = options;
    return ExamplePlugin;
  }

  constructor(
    @Inject(EXAMPLE_PLUGIN_OPTIONS) private options: ExamplePluginInitOptions
  ) {}
}
