CREATE TABLE `user_info` (
	`id` varchar(36) NOT NULL,
	`first_name` varchar(50) NOT NULL,
	`middle_name` varchar(50),
	`last_name` varchar(50) NOT NULL,
	`phone_number` varchar(20) NOT NULL,
	`address` varchar(100) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `user_info_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `user_info` ADD CONSTRAINT `user_info_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;