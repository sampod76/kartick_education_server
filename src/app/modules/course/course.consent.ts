export const COURSE_SEARCHABLE_FIELDS = [
  'title',
  'publisherName',
  'tag',
  'courseId',
];
export const COURSE_FILTERABLE_FIELDS = [
  'searchTerm',
  'price',
  'status',
  'publisher',
  'date',
  'categoryDetails.category',
  'reviews.star',
  'select',
  'course_mode',
  "type",// price type free/paid
];

export const COURSE_TYPES = ['free', 'paid', 'open', 'closed', 'recurrig'];
export const COURSE_MODES = ['pre_recorded', 'jobs', 'events'];
