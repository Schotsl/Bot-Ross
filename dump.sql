CREATE TABLE `bot-ross`.users (
	uuid binary(16) NOT NULL,

	discord bigint NOT NULL,

	lastname VARCHAR(255) NOT NULL,
	firstname VARCHAR(255) NOT NULL,
	
	created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (uuid)
)

CREATE TABLE `bot-ross`.sites (
	uuid binary(16) NOT NULL,
	owner binary(16) NOT NULL,

	url varchar(255) NOT NULL,
	title varchar(255) NOT NULL,

	online tinyint(1) DEFAULT '1',
	status tinyint(1) DEFAULT '0',
	plausible tinyint(1) DEFAULT '0',

	created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (uuid)
)

ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;