USER_SERVICE = user-service
AUTH_SERVICE = auth-service
ENGAGEMENT_SERVICE = engagement-service
NOTIFICATION_SERVICE = notification-service
VIDEO_SERVICE = video-service
MIGRATE_RUN = npm run migration:run
SCHEMA_DROP = npm run schema:drop

# Drop
drop-user:
	cd $(USER_SERVICE) && $(SCHEMA_DROP)

drop-auth:
	cd $(AUTH_SERVICE) && $(SCHEMA_DROP)

drop-engagement:
	cd $(ENGAGEMENT_SERVICE) && $(SCHEMA_DROP)

drop-notification:
	cd $(NOTIFICATION_SERVICE) && $(SCHEMA_DROP)

drop-video:
	cd $(VIDEO_SERVICE) && $(SCHEMA_DROP)

# Migrate
migrate-user:
	cd $(USER_SERVICE) && $(MIGRATE_RUN)

migrate-auth:
	cd $(AUTH_SERVICE) && $(MIGRATE_RUN)

migrate-engagement:
	cd $(ENGAGEMENT_SERVICE) && $(MIGRATE_RUN)

migrate-notification:
	cd $(NOTIFICATION_SERVICE) && $(MIGRATE_RUN)

migrate-video:
	cd $(VIDEO_SERVICE) && $(MIGRATE_RUN)


migrate-all: migrate-auth migrate-engagement migrate-notification migrate-user migrate-video
drop-and-migrate-all: drop-auth drop-engagement drop-notification drop-user drop-video migrate-auth migrate-engagement migrate-notification migrate-user migrate-video