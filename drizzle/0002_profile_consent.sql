ALTER TABLE "profiles" ADD COLUMN "terms_accepted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "marketing_opt_in" boolean DEFAULT false NOT NULL;