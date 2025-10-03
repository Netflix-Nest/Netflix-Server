import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1759113829549 implements MigrationInterface {
    name = 'Migration1759113829549'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "histories" RENAME COLUMN "contentId" TO "videoId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "histories" RENAME COLUMN "videoId" TO "contentId"`);
    }

}
