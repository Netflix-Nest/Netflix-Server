import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1755564438900 implements MigrationInterface {
    name = 'Initial1755564438900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bookmarks" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "contentId" integer NOT NULL, "timestamp" integer NOT NULL, "note" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, CONSTRAINT "PK_7f976ef6cecd37a53bd11685f32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c6065536f2f6de3a0163e19a58" ON "bookmarks" ("userId") `);
        await queryRunner.query(`CREATE TABLE "histories" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "contentId" integer NOT NULL, "watchedAt" TIMESTAMP NOT NULL, "duration" integer NOT NULL, "deviceInfo" character varying, CONSTRAINT "PK_36b0e707452a8b674f9d95da743" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0c320e3e56813ce3b175add32b" ON "histories" ("userId") `);
        await queryRunner.query(`CREATE TABLE "watchlists" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "content_ids" integer array NOT NULL DEFAULT '{}', "name" character varying NOT NULL, "thumbnail_url" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_aa3c717b50a10f7a435c65eda5a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e0afcc4fa46fa928db2fd30a04" ON "watchlists" ("userId", "content_ids") `);
        await queryRunner.query(`CREATE INDEX "IDX_4ee2b11c974ca3f516a391e154" ON "watchlists" ("userId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_4ee2b11c974ca3f516a391e154"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e0afcc4fa46fa928db2fd30a04"`);
        await queryRunner.query(`DROP TABLE "watchlists"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0c320e3e56813ce3b175add32b"`);
        await queryRunner.query(`DROP TABLE "histories"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c6065536f2f6de3a0163e19a58"`);
        await queryRunner.query(`DROP TABLE "bookmarks"`);
    }

}
