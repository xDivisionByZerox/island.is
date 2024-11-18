export default {
  production: false,
  indexableTypes: [
    'article',
    'subArticle',
    'lifeEventPage',
    'anchorPage',
    'articleCategory',
    'news',
    'page',
    'grant',
    'vidspyrnaPage',
    'menu',
    'groupedMenu',
    'organizationPage',
    'organizationSubpage',
    'projectPage',
    'supportQNA',
    'link',
    'frontpage',
    'enhancedAsset',
    'vacancy',
    'serviceWebPage',
    'event',
    'manual',
    'manualChapter',
    'customPage',
    'genericListItem',
    'teamList',
  ],
  nestedContentTypes: [
    'alertBanner',
    'anchorPageList',
    'organizationPage',
    'organization',
    'subArticle',
    'step',
    'stepper',
    'processEntry',
    'embeddedVideo',
    'faqList',
    'sliceConnectedComponent',
    'link',
    'linkUrl',
    'linkList',
    'questionAndAnswer',
    'sectionHeading',
    'sectionWithImage',
    'sectionWithVideo',
    'url',
    'articleGroup',
    'articleSubgroup',
    'articleCategory',
    'menuLink',
    'menuLinkWithChildren',
    'menu',
    'linkGroup',
    'districts',
    'featuredArticles',
    'oneColumnText',
    'twoColumnText',
    'accordionSlice',
    'lifeEventPage',
    'anchorPage',
    'referenceLink',
    'featured',
    'frontpageSlider',
    'namespace',
    'timeline',
    'timelineEvent',
    'form',
    'formField',
    'graphCard',
    'powerBiSlice',
    'tableSlice',
    'emailSignup',
    'tabSection',
    'tabContent',
    'footerItem',
    'featuredSupportQNAs',
    'uiConfiguration',
    'organizationTag',
    'logoListSlice',
    'article',
    'overviewLinks',
    'introLinkImage',
    'price',
    'teamList',
    'teamMember',
    'sliceDropdown',
    'sidebarCard',
    'genericTag',
    'latestNewsSlice',
    'latestEventsSlice',
    'supportCategory',
    'supportSubCategory',
    'manualChapter',
    'chart',
    'chartComponent',
    'featuredEvents',
    'bigBulletList',
    'iconBullet',
    'numberBulletSection',
    'numberBullet',
    'genericList',
  ],
  // Content types that have the 'activeTranslations' JSON field
  localizedContentTypes: ['article'],
  contentful: {
    space: process.env.CONTENTFUL_SPACE || '8k0h54kbe6bj',
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'test',
    environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    host: process.env.CONTENTFUL_HOST || 'cdn.contentful.com',
  },
  elastic: {
    node: process.env.ELASTIC_NODE || 'http://localhost:9200/',
  },
  runtimeEnvironment: process.env.ENVIRONMENT ?? 'local',
  forceSearchIndexerToResolveNestedEntries:
    process.env.FORCE_SEARCH_INDEXER_TO_RESOLVE_NESTED_ENTRIES ?? false,
}
