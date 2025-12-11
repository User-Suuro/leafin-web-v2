ALTER TABLE `account` MODIFY COLUMN `created_at` timestamp(3) NOT NULL;--> statement-breakpoint
ALTER TABLE `session` MODIFY COLUMN `created_at` timestamp(3) NOT NULL;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `created_at` timestamp(3) NOT NULL;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `updated_at` timestamp(3) NOT NULL;--> statement-breakpoint
ALTER TABLE `verification` MODIFY COLUMN `created_at` timestamp(3) NOT NULL;--> statement-breakpoint
ALTER TABLE `verification` MODIFY COLUMN `updated_at` timestamp(3) NOT NULL;--> statement-breakpoint
ALTER TABLE `session` ADD `impersonated_by` text;--> statement-breakpoint
ALTER TABLE `user` ADD `banned` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `user` ADD `ban_reason` text;--> statement-breakpoint
ALTER TABLE `user` ADD `ban_expires` timestamp(3);