API_GATEWAY = api-gateway
USER_SERVICE = user-service
AUTH_SERVICE = auth-service
COMMENT_SERVICE = comment-service
INTERACTION_SERVICE = interaction-service
ENGAGEMENT_SERVICE = engagement-service
JOB_SERVICE = job-service
NOTIFICATION_SERVICE = notification-service
RECOMMENDATION_SERVICE = recommendation-service
SEARCH_SERVICE = search-service
STORAGE_SERVICE = storage-service
VIDEO_SERVICE = video-service

MIGRATE_RUN = npm run migration:run
SCHEMA_DROP = npm run schema:drop
DO_SOMETHING = npm install @netflix-clone/common
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

# Do something
dosomething-gateway:
	cd $(API_GATEWAY) && $(DO_SOMETHING)
dosomething-auth:
	cd $(AUTH_SERVICE) && $(DO_SOMETHING)
dosomething-comment:
	cd $(COMMENT_SERVICE) && $(DO_SOMETHING)
dosomething-engagement:
	cd $(ENGAGEMENT_SERVICE) && $(DO_SOMETHING)
dosomething-interaction:
	cd $(INTERACTION_SERVICE) && $(DO_SOMETHING)
dosomething-job:
	cd $(JOB_SERVICE) && $(DO_SOMETHING)
dosomething-notification:
	cd $(NOTIFICATION_SERVICE) && $(DO_SOMETHING)
dosomething-recommendation: 
	cd $(RECOMMENDATION_SERVICE) && $(DO_SOMETHING)
dosomething-search:
	cd $(SEARCH_SERVICE) && $(DO_SOMETHING)
dosomething-storage:
	cd $(STORAGE_SERVICE) && $(DO_SOMETHING)
dosomething-video:
	cd $(VIDEO_SERVICE) && $(DO_SOMETHING)
dosomething-user:
	cd $(USER_SERVICE) && $(DO_SOMETHING)

# Docker
docker-up: 
	docker-compose up --scale job-service=0 --scale comment-service=0 --scale search-service=0 --scale kibana=0 --scale elasticsearch=0
docker-build: 
	docker-compose build --no-cache api-gateway video-service


migrate-all: migrate-auth migrate-engagement migrate-notification migrate-user migrate-video
drop-and-migrate-all: drop-auth drop-engagement drop-notification drop-user drop-video migrate-auth migrate-engagement migrate-notification migrate-user migrate-video
do-something-all: dosomething-gateway dosomething-auth dosomething-comment dosomething-engagement   dosomething-notification  dosomething-search dosomething-user dosomething-video dosomething-interaction dosomething-job dosomething-recommendation  dosomething-storage
# dosomething-interaction dosomething-job dosomething-recommendation  dosomething-storage
