import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1757221485722 implements MigrationInterface {
  name = 'Migration1757221485722';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "videos" DROP COLUMN "uploader"`);
    await queryRunner.query(
      `ALTER TABLE "videos" ADD "uploader" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "view"`);
    await queryRunner.query(
      `ALTER TABLE "contents" ADD "view" integer NOT NULL DEFAULT 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "view"`);
    await queryRunner.query(
      `ALTER TABLE "contents" ADD "view" bigint NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(`ALTER TABLE "videos" DROP COLUMN "uploader"`);
    await queryRunner.query(
      `ALTER TABLE "videos" ADD "uploader" bigint NOT NULL DEFAULT 1`,
    );
  }
}
