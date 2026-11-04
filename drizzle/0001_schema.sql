CREATE TYPE "public"."marker_layer" AS ENUM('trailer', 'leak', 'theory', 'mission', 'collectible', 'easter_egg');--> statement-breakpoint
CREATE TYPE "public"."review_vote" AS ENUM('keep', 'revert');--> statement-breakpoint
CREATE TYPE "public"."revision_state" AS ENUM('pending', 'accepted', 'reverted');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('member', 'reviewer', 'moderator');--> statement-breakpoint
CREATE TYPE "public"."section" AS ENUM('characters', 'vehicles', 'weapons', 'missions', 'locations', 'guides', 'lore');--> statement-breakpoint
CREATE TYPE "public"."source_kind" AS ENUM('official', 'community', 'none');--> statement-breakpoint
CREATE TYPE "public"."universe" AS ENUM('hd', '3d', '2d');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('official', 'leak', 'theory');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "builds" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"vehicle_id" integer NOT NULL,
	"author_id" text,
	"name" text NOT NULL,
	"choices" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "builds_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "channels" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "channels_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "comment_votes" (
	"comment_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"value" integer NOT NULL,
	CONSTRAINT "comment_votes_comment_id_user_id_pk" PRIMARY KEY("comment_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_id" integer NOT NULL,
	"parent_id" integer,
	"author_id" text,
	"body" text NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"reports" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"short_name" text NOT NULL,
	"year" integer NOT NULL,
	"universe" "universe" NOT NULL,
	"setting" text NOT NULL,
	"leads" text NOT NULL,
	"release_at" timestamp with time zone,
	"sort_order" integer NOT NULL,
	"summary" text,
	"image" text,
	"facts" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "games_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "map_markers" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"layer" "marker_layer" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"x" double precision NOT NULL,
	"y" double precision NOT NULL,
	"status" "verification_status",
	"source" text,
	"image" text,
	"page_id" integer,
	"visible_from" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "mod_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer NOT NULL,
	CONSTRAINT "mod_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "mod_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"deltas" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"body" text NOT NULL,
	"status" "verification_status",
	"source" text NOT NULL,
	"image" text,
	"sponsored" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "news_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"section" "section" NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"status" "verification_status",
	"source" text,
	"image" text,
	"infobox" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"current_revision_id" integer,
	"views" integer DEFAULT 0 NOT NULL,
	"search" "tsvector" GENERATED ALWAYS AS (setweight(to_tsvector('english', title), 'A') || setweight(to_tsvector('english', summary), 'B')) STORED,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_votes" (
	"post_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"value" integer NOT NULL,
	CONSTRAINT "post_votes_post_id_user_id_pk" PRIMARY KEY("post_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"thread_id" integer NOT NULL,
	"parent_id" integer,
	"author_id" text,
	"body" text NOT NULL,
	"spoiler" boolean DEFAULT false NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"avatar" text DEFAULT 'lucia' NOT NULL,
	"favorite_game_id" integer,
	"rep" integer DEFAULT 0 NOT NULL,
	"role" "role" DEFAULT 'member' NOT NULL,
	"bio" text,
	"onboarded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reputation_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"kind" text NOT NULL,
	"amount" integer NOT NULL,
	"ref" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revision_votes" (
	"revision_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"vote" "review_vote" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "revision_votes_revision_id_user_id_pk" PRIMARY KEY("revision_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "revisions" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_id" integer NOT NULL,
	"author_id" text,
	"parent_id" integer,
	"body" text NOT NULL,
	"summary" text NOT NULL,
	"source_kind" "source_kind" NOT NULL,
	"source" text,
	"state" "revision_state" NOT NULL,
	"size_delta" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"closed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "theories" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_id" integer NOT NULL,
	"author_id" text,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"plausible_votes" integer DEFAULT 0 NOT NULL,
	"total_votes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "theory_votes" (
	"theory_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"value" integer NOT NULL,
	CONSTRAINT "theory_votes_theory_id_user_id_pk" PRIMARY KEY("theory_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "thread_pages" (
	"thread_id" integer NOT NULL,
	"page_id" integer NOT NULL,
	CONSTRAINT "thread_pages_thread_id_page_id_pk" PRIMARY KEY("thread_id","page_id")
);
--> statement-breakpoint
CREATE TABLE "thread_tags" (
	"thread_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "thread_tags_thread_id_tag_id_pk" PRIMARY KEY("thread_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "thread_votes" (
	"thread_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"value" integer NOT NULL,
	CONSTRAINT "thread_votes_thread_id_user_id_pk" PRIMARY KEY("thread_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "threads" (
	"id" serial PRIMARY KEY NOT NULL,
	"channel_id" integer NOT NULL,
	"author_id" text,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"body" text NOT NULL,
	"image" text,
	"spoiler" boolean DEFAULT false NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"reply_count" integer DEFAULT 0 NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"search" "tsvector" GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || body)) STORED,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_activity_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"page_id" integer,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"class" text NOT NULL,
	"image" text,
	"seats" integer,
	"top_speed_mph" double precision,
	"zero_to_sixty" double precision,
	"braking_ft" double precision,
	"armor_slots" integer,
	"price" integer,
	"where_to_get" text,
	"specs_sample" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "builds" ADD CONSTRAINT "builds_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "builds" ADD CONSTRAINT "builds_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_votes" ADD CONSTRAINT "comment_votes_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_votes" ADD CONSTRAINT "comment_votes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_comments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map_markers" ADD CONSTRAINT "map_markers_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map_markers" ADD CONSTRAINT "map_markers_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mod_options" ADD CONSTRAINT "mod_options_category_id_mod_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."mod_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news" ADD CONSTRAINT "news_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_current_revision_id_revisions_id_fk" FOREIGN KEY ("current_revision_id") REFERENCES "public"."revisions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_thread_id_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_favorite_game_id_games_id_fk" FOREIGN KEY ("favorite_game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reputation_events" ADD CONSTRAINT "reputation_events_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revision_votes" ADD CONSTRAINT "revision_votes_revision_id_revisions_id_fk" FOREIGN KEY ("revision_id") REFERENCES "public"."revisions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revision_votes" ADD CONSTRAINT "revision_votes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revisions" ADD CONSTRAINT "revisions_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revisions" ADD CONSTRAINT "revisions_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revisions" ADD CONSTRAINT "revisions_parent_id_revisions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."revisions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theories" ADD CONSTRAINT "theories_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theories" ADD CONSTRAINT "theories_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theory_votes" ADD CONSTRAINT "theory_votes_theory_id_theories_id_fk" FOREIGN KEY ("theory_id") REFERENCES "public"."theories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theory_votes" ADD CONSTRAINT "theory_votes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_pages" ADD CONSTRAINT "thread_pages_thread_id_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_pages" ADD CONSTRAINT "thread_pages_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_tags" ADD CONSTRAINT "thread_tags_thread_id_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_tags" ADD CONSTRAINT "thread_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_votes" ADD CONSTRAINT "thread_votes_thread_id_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_votes" ADD CONSTRAINT "thread_votes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "comments_page_idx" ON "comments" USING btree ("page_id");--> statement-breakpoint
CREATE INDEX "map_markers_game_idx" ON "map_markers" USING btree ("game_id","layer");--> statement-breakpoint
CREATE INDEX "mod_options_category_idx" ON "mod_options" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "news_published_idx" ON "news" USING btree ("published_at");--> statement-breakpoint
CREATE UNIQUE INDEX "pages_path_idx" ON "pages" USING btree ("game_id","section","slug");--> statement-breakpoint
CREATE INDEX "pages_search_idx" ON "pages" USING gin ("search");--> statement-breakpoint
CREATE INDEX "pages_title_trgm_idx" ON "pages" USING gin ("title" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "posts_thread_idx" ON "posts" USING btree ("thread_id");--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_username_idx" ON "profiles" USING btree (lower("username"));--> statement-breakpoint
CREATE UNIQUE INDEX "reputation_once_idx" ON "reputation_events" USING btree ("kind","ref");--> statement-breakpoint
CREATE INDEX "reputation_user_idx" ON "reputation_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "revisions_page_idx" ON "revisions" USING btree ("page_id","created_at");--> statement-breakpoint
CREATE INDEX "revisions_state_idx" ON "revisions" USING btree ("state");--> statement-breakpoint
CREATE INDEX "session_user_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "theories_page_idx" ON "theories" USING btree ("page_id");--> statement-breakpoint
CREATE UNIQUE INDEX "threads_path_idx" ON "threads" USING btree ("channel_id","slug");--> statement-breakpoint
CREATE INDEX "threads_search_idx" ON "threads" USING gin ("search");--> statement-breakpoint
CREATE INDEX "threads_title_trgm_idx" ON "threads" USING gin ("title" gin_trgm_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "vehicles_path_idx" ON "vehicles" USING btree ("game_id","slug");