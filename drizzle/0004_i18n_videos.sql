CREATE TABLE "videos" (
	"youtube_id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"game_id" integer,
	"kind" text NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "channels" ADD COLUMN "i18n" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "i18n" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "i18n" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "video" text;--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "i18n" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "current_revision_pt" integer;--> statement-breakpoint
ALTER TABLE "revisions" ADD COLUMN "locale" text DEFAULT 'en' NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "videos_game_idx" ON "videos" USING btree ("game_id","position");--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_current_revision_pt_revisions_id_fk" FOREIGN KEY ("current_revision_pt") REFERENCES "public"."revisions"("id") ON DELETE no action ON UPDATE no action;