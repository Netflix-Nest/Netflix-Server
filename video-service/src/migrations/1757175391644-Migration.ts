import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1757175391644 implements MigrationInterface {
    name = 'Migration1757175391644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contents" DROP CONSTRAINT "FK_ece7607f9b240a9dadcb60bd2d8"`);
        await queryRunner.query(`ALTER TABLE "contents" RENAME COLUMN "trailerId" TO "trailer"`);
        await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "trailer"`);
        await queryRunner.query(`ALTER TABLE "contents" ADD "trailer" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "trailer"`);
        await queryRunner.query(`ALTER TABLE "contents" ADD "trailer" integer`);
        await queryRunner.query(`ALTER TABLE "contents" RENAME COLUMN "trailer" TO "trailerId"`);
        await queryRunner.query(`ALTER TABLE "contents" ADD CONSTRAINT "FK_ece7607f9b240a9dadcb60bd2d8" FOREIGN KEY ("trailerId") REFERENCES "videos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
