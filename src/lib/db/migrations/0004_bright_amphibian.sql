CREATE TABLE `expenses` (
	`expense_id` int AUTO_INCREMENT NOT NULL,
	`expense_date` date NOT NULL,
	`category` enum('feed','maintenance','utilities','other') NOT NULL,
	`description` text,
	`amount` decimal(10,2) NOT NULL,
	`related_fish_batch_id` int,
	`related_plant_batch_id` int,
	CONSTRAINT `expenses_expense_id` PRIMARY KEY(`expense_id`)
);
--> statement-breakpoint
CREATE TABLE `fish_sales` (
	`fish_sale_id` int AUTO_INCREMENT NOT NULL,
	`fish_batch_id` int NOT NULL,
	`sale_date` date NOT NULL,
	`total_sale_amount` decimal(10,2) NOT NULL,
	`customer_name` varchar(100),
	`notes` text,
	CONSTRAINT `fish_sales_fish_sale_id` PRIMARY KEY(`fish_sale_id`)
);
--> statement-breakpoint
CREATE TABLE `plant_sales` (
	`plant_sale_id` int AUTO_INCREMENT NOT NULL,
	`plant_batch_id` int NOT NULL,
	`sale_date` date NOT NULL,
	`total_sale_amount` decimal(10,2) NOT NULL,
	`customer_name` varchar(100),
	`notes` text,
	CONSTRAINT `plant_sales_plant_sale_id` PRIMARY KEY(`plant_sale_id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`task_id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(100) NOT NULL,
	`description` text,
	`task_type` enum('feeding','maintenance','cleaning','harvest','planting','other') NOT NULL,
	`scheduled_date` date,
	`scheduled_time` time,
	`status` enum('pending','in_progress','completed') DEFAULT 'pending',
	`related_fish_batch_id` int,
	`related_plant_batch_id` int,
	CONSTRAINT `tasks_task_id` PRIMARY KEY(`task_id`)
);
--> statement-breakpoint
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_related_fish_batch_id_fish_batch_fish_batch_id_fk` FOREIGN KEY (`related_fish_batch_id`) REFERENCES `fish_batch`(`fish_batch_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_related_plant_batch_id_plant_batch_plant_batch_id_fk` FOREIGN KEY (`related_plant_batch_id`) REFERENCES `plant_batch`(`plant_batch_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fish_sales` ADD CONSTRAINT `fish_sales_fish_batch_id_fish_batch_fish_batch_id_fk` FOREIGN KEY (`fish_batch_id`) REFERENCES `fish_batch`(`fish_batch_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `plant_sales` ADD CONSTRAINT `plant_sales_plant_batch_id_plant_batch_plant_batch_id_fk` FOREIGN KEY (`plant_batch_id`) REFERENCES `plant_batch`(`plant_batch_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_related_fish_batch_id_fish_batch_fish_batch_id_fk` FOREIGN KEY (`related_fish_batch_id`) REFERENCES `fish_batch`(`fish_batch_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_related_plant_batch_id_plant_batch_plant_batch_id_fk` FOREIGN KEY (`related_plant_batch_id`) REFERENCES `plant_batch`(`plant_batch_id`) ON DELETE no action ON UPDATE no action;