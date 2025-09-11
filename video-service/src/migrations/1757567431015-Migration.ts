import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1757567431015 implements MigrationInterface {
    name = 'Migration1757567431015'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "totalScoreRating"`);
        await queryRunner.query(`ALTER TABLE "contents" ADD "totalScoreRating" integer NOT NULL DEFAULT '5'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "totalScoreRating"`);
        await queryRunner.query(`ALTER TABLE "contents" ADD "totalScoreRating" double precision NOT NULL DEFAULT '5'`);
    }

}
