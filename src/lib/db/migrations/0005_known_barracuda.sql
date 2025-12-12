CREATE TABLE `feeder_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`frequency_per_day` int NOT NULL DEFAULT 1,
	`schedules` varchar(500) NOT NULL,
	`feed_quantity` int NOT NULL DEFAULT 10,
	`last_feed_time` varchar(100),
	`next_feed_time` varchar(100),
	CONSTRAINT `feeder_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `motor` (
	`motor_id` int AUTO_INCREMENT NOT NULL,
	`main_pump` boolean NOT NULL,
	`mini_pump` boolean NOT NULL,
	`status` boolean NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `motor_motor_id` PRIMARY KEY(`motor_id`)
);
