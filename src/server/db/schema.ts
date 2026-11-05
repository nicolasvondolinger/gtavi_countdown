import { sql } from 'drizzle-orm';
import {
  boolean,
  customType,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';

const tsvector = customType<{ data: string }>({ dataType: () => 'tsvector' });
const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

export const universe = pgEnum('universe', ['hd', '3d', '2d']);
export const section = pgEnum('section', ['characters', 'vehicles', 'weapons', 'missions', 'locations', 'guides', 'lore']);
export const verification = pgEnum('verification_status', ['official', 'leak', 'theory']);
export const sourceKind = pgEnum('source_kind', ['official', 'community', 'none']);
export const revisionState = pgEnum('revision_state', ['pending', 'accepted', 'reverted']);
export const reviewVote = pgEnum('review_vote', ['keep', 'revert']);
export const role = pgEnum('role', ['member', 'reviewer', 'moderator']);
export const markerLayer = pgEnum('marker_layer', ['trailer', 'leak', 'theory', 'mission', 'collectible', 'easter_egg']);

// Better Auth tables. Column names follow its Drizzle adapter.
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  t => [index('session_user_idx').on(t.userId)],
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
    scope: text('scope'),
    password: text('password'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  t => [index('account_user_idx').on(t.userId)],
);

export const verificationToken = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const games = pgTable('games', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  shortName: text('short_name').notNull(),
  year: integer('year').notNull(),
  universe: universe('universe').notNull(),
  setting: text('setting').notNull(),
  leads: text('leads').notNull(),
  releaseAt: timestamp('release_at', { withTimezone: true }),
  sortOrder: integer('sort_order').notNull(),
  summary: text('summary'),
  image: text('image'),
  // Label and value pairs shown on the game hub.
  facts: jsonb('facts').$type<{ label: string; value: string }[]>().notNull().default([]),
});

export const profiles = pgTable(
  'profiles',
  {
    userId: text('user_id')
      .primaryKey()
      .references(() => user.id, { onDelete: 'cascade' }),
    username: text('username').notNull(),
    avatar: text('avatar').notNull().default('lucia'),
    favoriteGameId: integer('favorite_game_id').references(() => games.id),
    rep: integer('rep').notNull().default(0),
    role: role('role').notNull().default('member'),
    bio: text('bio'),
    onboardedAt: timestamp('onboarded_at', { withTimezone: true }),
    termsAcceptedAt: timestamp('terms_accepted_at', { withTimezone: true }),
    marketingOptIn: boolean('marketing_opt_in').notNull().default(false),
    createdAt: createdAt(),
  },
  t => [uniqueIndex('profiles_username_idx').on(sql`lower(${t.username})`)],
);

export const pages = pgTable(
  'pages',
  {
    id: serial('id').primaryKey(),
    gameId: integer('game_id')
      .notNull()
      .references(() => games.id),
    section: section('section').notNull(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    summary: text('summary').notNull().default(''),
    status: verification('status'),
    source: text('source'),
    image: text('image'),
    infobox: jsonb('infobox').$type<{ label: string; value: string; status?: 'official' | 'leak' | 'theory' }[]>().notNull().default([]),
    gallery: jsonb('gallery').$type<string[]>().notNull().default([]),
    currentRevisionId: integer('current_revision_id').references((): AnyPgColumn => revisions.id),
    views: integer('views').notNull().default(0),
    search: tsvector('search').generatedAlwaysAs(
      sql`setweight(to_tsvector('english', title), 'A') || setweight(to_tsvector('english', summary), 'B')`,
    ),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  t => [
    uniqueIndex('pages_path_idx').on(t.gameId, t.section, t.slug),
    index('pages_search_idx').using('gin', t.search),
    index('pages_title_trgm_idx').using('gin', sql`${t.title} gin_trgm_ops`),
  ],
);

export const revisions = pgTable(
  'revisions',
  {
    id: serial('id').primaryKey(),
    pageId: integer('page_id')
      .notNull()
      .references(() => pages.id, { onDelete: 'cascade' }),
    authorId: text('author_id').references(() => user.id, { onDelete: 'set null' }),
    parentId: integer('parent_id').references((): AnyPgColumn => revisions.id),
    body: text('body').notNull(),
    summary: text('summary').notNull(),
    sourceKind: sourceKind('source_kind').notNull(),
    source: text('source'),
    state: revisionState('state').notNull(),
    sizeDelta: integer('size_delta').notNull().default(0),
    createdAt: createdAt(),
    closedAt: timestamp('closed_at', { withTimezone: true }),
  },
  t => [index('revisions_page_idx').on(t.pageId, t.createdAt), index('revisions_state_idx').on(t.state)],
);

export const revisionVotes = pgTable(
  'revision_votes',
  {
    revisionId: integer('revision_id')
      .notNull()
      .references(() => revisions.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    vote: reviewVote('vote').notNull(),
    createdAt: createdAt(),
  },
  t => [primaryKey({ columns: [t.revisionId, t.userId] })],
);

export const reputationEvents = pgTable(
  'reputation_events',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    kind: text('kind').notNull(),
    amount: integer('amount').notNull(),
    // What earned it, such as `revision:12`. Unique with kind so a rule can never pay twice.
    ref: text('ref').notNull(),
    createdAt: createdAt(),
  },
  t => [uniqueIndex('reputation_once_idx').on(t.kind, t.ref), index('reputation_user_idx').on(t.userId)],
);

export const notifications = pgTable(
  'notifications',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    href: text('href').notNull(),
    readAt: timestamp('read_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  t => [index('notifications_user_idx').on(t.userId, t.createdAt)],
);

export const contentReports = pgTable(
  'content_reports',
  {
    kind: text('kind').notNull(),
    targetId: integer('target_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: createdAt(),
  },
  t => [primaryKey({ columns: [t.kind, t.targetId, t.userId] })],
);

export const moderationLog = pgTable('moderation_log', {
  id: serial('id').primaryKey(),
  moderatorId: text('moderator_id').references(() => user.id, { onDelete: 'set null' }),
  action: text('action').notNull(),
  target: text('target').notNull(),
  createdAt: createdAt(),
});

export const theories = pgTable(
  'theories',
  {
    id: serial('id').primaryKey(),
    pageId: integer('page_id')
      .notNull()
      .references(() => pages.id, { onDelete: 'cascade' }),
    authorId: text('author_id').references(() => user.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    body: text('body').notNull(),
    score: integer('score').notNull().default(0),
    plausibleVotes: integer('plausible_votes').notNull().default(0),
    totalVotes: integer('total_votes').notNull().default(0),
    createdAt: createdAt(),
  },
  t => [index('theories_page_idx').on(t.pageId)],
);

export const theoryVotes = pgTable(
  'theory_votes',
  {
    theoryId: integer('theory_id')
      .notNull()
      .references(() => theories.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    value: integer('value').notNull(),
  },
  t => [primaryKey({ columns: [t.theoryId, t.userId] })],
);

export const comments = pgTable(
  'comments',
  {
    id: serial('id').primaryKey(),
    pageId: integer('page_id')
      .notNull()
      .references(() => pages.id, { onDelete: 'cascade' }),
    parentId: integer('parent_id').references((): AnyPgColumn => comments.id, { onDelete: 'cascade' }),
    authorId: text('author_id').references(() => user.id, { onDelete: 'set null' }),
    body: text('body').notNull(),
    score: integer('score').notNull().default(0),
    reports: integer('reports').notNull().default(0),
    removed: boolean('removed').notNull().default(false),
    createdAt: createdAt(),
  },
  t => [index('comments_page_idx').on(t.pageId)],
);

export const commentVotes = pgTable(
  'comment_votes',
  {
    commentId: integer('comment_id')
      .notNull()
      .references(() => comments.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    value: integer('value').notNull(),
  },
  t => [primaryKey({ columns: [t.commentId, t.userId] })],
);

export const channels = pgTable('channels', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const threads = pgTable(
  'threads',
  {
    id: serial('id').primaryKey(),
    channelId: integer('channel_id')
      .notNull()
      .references(() => channels.id),
    authorId: text('author_id').references(() => user.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    body: text('body').notNull(),
    image: text('image'),
    spoiler: boolean('spoiler').notNull().default(false),
    pinned: boolean('pinned').notNull().default(false),
    score: integer('score').notNull().default(0),
    replyCount: integer('reply_count').notNull().default(0),
    views: integer('views').notNull().default(0),
    search: tsvector('search').generatedAlwaysAs(sql`to_tsvector('english', title || ' ' || body)`),
    createdAt: createdAt(),
    lastActivityAt: timestamp('last_activity_at', { withTimezone: true }).notNull().defaultNow(),
  },
  t => [
    uniqueIndex('threads_path_idx').on(t.channelId, t.slug),
    index('threads_search_idx').using('gin', t.search),
    index('threads_title_trgm_idx').using('gin', sql`${t.title} gin_trgm_ops`),
  ],
);

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
});

export const threadTags = pgTable(
  'thread_tags',
  {
    threadId: integer('thread_id')
      .notNull()
      .references(() => threads.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  t => [primaryKey({ columns: [t.threadId, t.tagId] })],
);

export const threadPages = pgTable(
  'thread_pages',
  {
    threadId: integer('thread_id')
      .notNull()
      .references(() => threads.id, { onDelete: 'cascade' }),
    pageId: integer('page_id')
      .notNull()
      .references(() => pages.id, { onDelete: 'cascade' }),
  },
  t => [primaryKey({ columns: [t.threadId, t.pageId] })],
);

export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    threadId: integer('thread_id')
      .notNull()
      .references(() => threads.id, { onDelete: 'cascade' }),
    parentId: integer('parent_id').references((): AnyPgColumn => posts.id, { onDelete: 'cascade' }),
    authorId: text('author_id').references(() => user.id, { onDelete: 'set null' }),
    body: text('body').notNull(),
    spoiler: boolean('spoiler').notNull().default(false),
    score: integer('score').notNull().default(0),
    reports: integer('reports').notNull().default(0),
    removed: boolean('removed').notNull().default(false),
    createdAt: createdAt(),
  },
  t => [index('posts_thread_idx').on(t.threadId)],
);

export const threadVotes = pgTable(
  'thread_votes',
  {
    threadId: integer('thread_id')
      .notNull()
      .references(() => threads.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    value: integer('value').notNull(),
  },
  t => [primaryKey({ columns: [t.threadId, t.userId] })],
);

export const postVotes = pgTable(
  'post_votes',
  {
    postId: integer('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    value: integer('value').notNull(),
  },
  t => [primaryKey({ columns: [t.postId, t.userId] })],
);

export const news = pgTable(
  'news',
  {
    id: serial('id').primaryKey(),
    gameId: integer('game_id').references(() => games.id),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    excerpt: text('excerpt').notNull(),
    body: text('body').notNull(),
    status: verification('status'),
    source: text('source').notNull(),
    image: text('image'),
    sponsored: boolean('sponsored').notNull().default(false),
    publishedAt: timestamp('published_at', { withTimezone: true }).notNull().defaultNow(),
  },
  t => [index('news_published_idx').on(t.publishedAt)],
);

export const vehicles = pgTable(
  'vehicles',
  {
    id: serial('id').primaryKey(),
    gameId: integer('game_id')
      .notNull()
      .references(() => games.id),
    pageId: integer('page_id').references(() => pages.id),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    class: text('class').notNull(),
    image: text('image'),
    seats: integer('seats'),
    // Null means not measured yet. The UI shows that as unknown, never as zero.
    topSpeedMph: doublePrecision('top_speed_mph'),
    zeroToSixty: doublePrecision('zero_to_sixty'),
    brakingFt: doublePrecision('braking_ft'),
    armorSlots: integer('armor_slots'),
    price: integer('price'),
    whereToGet: text('where_to_get'),
    specsSample: boolean('specs_sample').notNull().default(false),
  },
  t => [uniqueIndex('vehicles_path_idx').on(t.gameId, t.slug)],
);

export const modCategories = pgTable('mod_categories', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  sortOrder: integer('sort_order').notNull(),
});

export const modOptions = pgTable(
  'mod_options',
  {
    id: serial('id').primaryKey(),
    categoryId: integer('category_id')
      .notNull()
      .references(() => modCategories.id),
    name: text('name').notNull(),
    price: integer('price').notNull(),
    // Stat changes on a 0 to 100 scale, keyed by acceleration, topSpeed, braking, handling, armor.
    deltas: jsonb('deltas').$type<Record<string, number>>().notNull().default({}),
    sortOrder: integer('sort_order').notNull(),
  },
  t => [index('mod_options_category_idx').on(t.categoryId)],
);

export const builds = pgTable('builds', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  vehicleId: integer('vehicle_id')
    .notNull()
    .references(() => vehicles.id),
  authorId: text('author_id').references(() => user.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  // Map of category slug to option id.
  choices: jsonb('choices').$type<Record<string, number>>().notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const mapMarkers = pgTable(
  'map_markers',
  {
    id: serial('id').primaryKey(),
    gameId: integer('game_id')
      .notNull()
      .references(() => games.id),
    layer: markerLayer('layer').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    // Position on the game map, 0 to 1 on each axis.
    x: doublePrecision('x').notNull(),
    y: doublePrecision('y').notNull(),
    status: verification('status'),
    source: text('source'),
    image: text('image'),
    pageId: integer('page_id').references(() => pages.id),
    visibleFrom: timestamp('visible_from', { withTimezone: true }),
  },
  t => [index('map_markers_game_idx').on(t.gameId, t.layer)],
);
