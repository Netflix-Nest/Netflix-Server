import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1755564074976 implements MigrationInterface {
    name = 'Initial1755564074976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "genres" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "thumbnailUrl" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_f105f8230a83b86a346427de94d" UNIQUE ("name"), CONSTRAINT "PK_80ecd718f0f00dde5d77a9be842" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f105f8230a83b86a346427de94" ON "genres" ("name") `);
        await queryRunner.query(`CREATE TABLE "series" ("id" SERIAL NOT NULL, "totalEpisodes" integer, "seasonNumber" integer NOT NULL, "totalSeasonNumber" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_e725676647382eb54540d7128ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d90243459a697eadb8ad56e909" ON "tags" ("name") `);
        await queryRunner.query(`CREATE TABLE "videos" ("id" SERIAL NOT NULL, "episodeNumber" integer, "seasonNumber" integer, "uploader" bigint NOT NULL, "status" character varying NOT NULL, "originalUrl" character varying, "hlsUrl" character varying, "fileName" character varying, "duration" double precision, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "contentsId" integer, CONSTRAINT "REL_1bec484614bbde7e66eb66018a" UNIQUE ("contentsId"), CONSTRAINT "PK_e4c86c0cf95aff16e9fb8220f6b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contents" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying, "thumbnail" character varying, "country" character varying, "director" character varying, "type" character varying NOT NULL DEFAULT 'single', "year" integer NOT NULL, "view" bigint NOT NULL, "followers" integer array, "publishAt" TIMESTAMP, "quality" character varying NOT NULL, "totalScoreRating" double precision NOT NULL DEFAULT '0', "ratingCount" integer NOT NULL DEFAULT '0', "likeCount" integer NOT NULL DEFAULT '0', "studio" character varying NOT NULL, "season" character varying NOT NULL, "ageRating" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "seriesId" integer, "trailerId" integer, CONSTRAINT "UQ_214ca676bed3cd02947f6d64bcf" UNIQUE ("title"), CONSTRAINT "UQ_8a8cf14dab55b4ebcd93bb536a1" UNIQUE ("slug"), CONSTRAINT "REL_43ae374c07fd7a94c0cffe8a34" UNIQUE ("seriesId"), CONSTRAINT "REL_ece7607f9b240a9dadcb60bd2d" UNIQUE ("trailerId"), CONSTRAINT "PK_b7c504072e537532d7080c54fac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_92146db9ebb3a9b59edcc522ba" ON "contents" ("year") `);
        await queryRunner.query(`CREATE INDEX "IDX_c777baa6b66dce57704a571358" ON "contents" ("type") `);
        await queryRunner.query(`CREATE INDEX "IDX_214ca676bed3cd02947f6d64bc" ON "contents" ("title") `);
        await queryRunner.query(`CREATE TABLE "actors" ("id" SERIAL NOT NULL, "fullName" character varying NOT NULL, "avatarUrl" character varying, "birthDate" TIMESTAMP, "nationality" character varying, "biography" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_d8608598c2c4f907a78de2ae461" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_95d88c395389a92611a4fd3365" ON "actors" ("fullName") `);
        await queryRunner.query(`CREATE TABLE "contents_genres_genres" ("contentsId" integer NOT NULL, "genresId" integer NOT NULL, CONSTRAINT "PK_7e61a6f312213faeb3b7d11e8c5" PRIMARY KEY ("contentsId", "genresId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fa143c93338376483d7d6674ce" ON "contents_genres_genres" ("contentsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_05359ab6cc36b1d39bc5fe6555" ON "contents_genres_genres" ("genresId") `);
        await queryRunner.query(`CREATE TABLE "contents_tags_tags" ("contentsId" integer NOT NULL, "tagsId" integer NOT NULL, CONSTRAINT "PK_6e00008402d84a22ef535c027bf" PRIMARY KEY ("contentsId", "tagsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3ae79a35bc259ac13e67b0a6b1" ON "contents_tags_tags" ("contentsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_67936e3133ef28b32355334af2" ON "contents_tags_tags" ("tagsId") `);
        await queryRunner.query(`CREATE TABLE "contents_actors_actors" ("contentsId" integer NOT NULL, "actorsId" integer NOT NULL, CONSTRAINT "PK_b3e75094137fc4d0a3f5834aa63" PRIMARY KEY ("contentsId", "actorsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ce9e6c5341102182999ae7330d" ON "contents_actors_actors" ("contentsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4d1d13a333a231bb3bdc67c62a" ON "contents_actors_actors" ("actorsId") `);
        await queryRunner.query(`ALTER TABLE "videos" ADD CONSTRAINT "FK_1bec484614bbde7e66eb66018ae" FOREIGN KEY ("contentsId") REFERENCES "contents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contents" ADD CONSTRAINT "FK_43ae374c07fd7a94c0cffe8a344" FOREIGN KEY ("seriesId") REFERENCES "series"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contents" ADD CONSTRAINT "FK_ece7607f9b240a9dadcb60bd2d8" FOREIGN KEY ("trailerId") REFERENCES "videos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contents_genres_genres" ADD CONSTRAINT "FK_fa143c93338376483d7d6674ceb" FOREIGN KEY ("contentsId") REFERENCES "contents"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "contents_genres_genres" ADD CONSTRAINT "FK_05359ab6cc36b1d39bc5fe6555a" FOREIGN KEY ("genresId") REFERENCES "genres"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contents_tags_tags" ADD CONSTRAINT "FK_3ae79a35bc259ac13e67b0a6b1f" FOREIGN KEY ("contentsId") REFERENCES "contents"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "contents_tags_tags" ADD CONSTRAINT "FK_67936e3133ef28b32355334af20" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contents_actors_actors" ADD CONSTRAINT "FK_ce9e6c5341102182999ae7330d7" FOREIGN KEY ("contentsId") REFERENCES "contents"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "contents_actors_actors" ADD CONSTRAINT "FK_4d1d13a333a231bb3bdc67c62a5" FOREIGN KEY ("actorsId") REFERENCES "actors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contents_actors_actors" DROP CONSTRAINT "FK_4d1d13a333a231bb3bdc67c62a5"`);
        await queryRunner.query(`ALTER TABLE "contents_actors_actors" DROP CONSTRAINT "FK_ce9e6c5341102182999ae7330d7"`);
        await queryRunner.query(`ALTER TABLE "contents_tags_tags" DROP CONSTRAINT "FK_67936e3133ef28b32355334af20"`);
        await queryRunner.query(`ALTER TABLE "contents_tags_tags" DROP CONSTRAINT "FK_3ae79a35bc259ac13e67b0a6b1f"`);
        await queryRunner.query(`ALTER TABLE "contents_genres_genres" DROP CONSTRAINT "FK_05359ab6cc36b1d39bc5fe6555a"`);
        await queryRunner.query(`ALTER TABLE "contents_genres_genres" DROP CONSTRAINT "FK_fa143c93338376483d7d6674ceb"`);
        await queryRunner.query(`ALTER TABLE "contents" DROP CONSTRAINT "FK_ece7607f9b240a9dadcb60bd2d8"`);
        await queryRunner.query(`ALTER TABLE "contents" DROP CONSTRAINT "FK_43ae374c07fd7a94c0cffe8a344"`);
        await queryRunner.query(`ALTER TABLE "videos" DROP CONSTRAINT "FK_1bec484614bbde7e66eb66018ae"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4d1d13a333a231bb3bdc67c62a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ce9e6c5341102182999ae7330d"`);
        await queryRunner.query(`DROP TABLE "contents_actors_actors"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_67936e3133ef28b32355334af2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3ae79a35bc259ac13e67b0a6b1"`);
        await queryRunner.query(`DROP TABLE "contents_tags_tags"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_05359ab6cc36b1d39bc5fe6555"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fa143c93338376483d7d6674ce"`);
        await queryRunner.query(`DROP TABLE "contents_genres_genres"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_95d88c395389a92611a4fd3365"`);
        await queryRunner.query(`DROP TABLE "actors"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_214ca676bed3cd02947f6d64bc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c777baa6b66dce57704a571358"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_92146db9ebb3a9b59edcc522ba"`);
        await queryRunner.query(`DROP TABLE "contents"`);
        await queryRunner.query(`DROP TABLE "videos"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d90243459a697eadb8ad56e909"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "series"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f105f8230a83b86a346427de94"`);
        await queryRunner.query(`DROP TABLE "genres"`);
    }

}
