import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1757430486410 implements MigrationInterface {
    name = 'Migration1757430486410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contents" ALTER COLUMN "totalScoreRating" SET DEFAULT '5'`);
        await queryRunner.query(`ALTER TABLE "contents" ALTER COLUMN "ratingCount" SET DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contents" ALTER COLUMN "ratingCount" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "contents" ALTER COLUMN "totalScoreRating" SET DEFAULT '0'`);
    }

}
