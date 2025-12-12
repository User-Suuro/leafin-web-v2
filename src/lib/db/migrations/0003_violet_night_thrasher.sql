CREATE TABLE `fish_batch` (
	`fish_batch_id` int AUTO_INCREMENT NOT NULL,
	`fish_quantity` int NOT NULL,
	`date_added` datetime NOT NULL,
	`conditions` varchar(50),
	`expected_harvest_date` date,
	`batch_status` enum('growing','ready','harvested','discarded') DEFAULT 'growing',
	CONSTRAINT `fish_batch_fish_batch_id` PRIMARY KEY(`fish_batch_id`)
);
--> statement-breakpoint
CREATE TABLE `plant_batch` (
	`plant_batch_id` int AUTO_INCREMENT NOT NULL,
	`plant_quantity` int NOT NULL,
	`date_added` datetime NOT NULL,
	`conditions` varchar(50),
	`expected_harvest_date` date,
	`batch_status` enum('growing','ready','harvested','discarded') DEFAULT 'growing',
	CONSTRAINT `plant_batch_plant_batch_id` PRIMARY KEY(`plant_batch_id`)
);
--> statement-breakpoint
CREATE TABLE `sensor_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`time` varchar(100) NOT NULL,
	`date` varchar(100) NOT NULL,
	`ph` varchar(100) NOT NULL,
	`turbid` varchar(100) NOT NULL,
	`water_temp` varchar(100) NOT NULL,
	`tds` varchar(100) NOT NULL,
	`float_switch` boolean NOT NULL,
	`nh3_gas` varchar(100) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sensor_data_id` PRIMARY KEY(`id`)
);
