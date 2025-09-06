import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1757155066878 implements MigrationInterface {
    name = 'Migration1757155066878'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos" DROP CONSTRAINT "FK_1bec484614bbde7e66eb66018ae"`);
        await queryRunner.query(`ALTER TABLE "videos" DROP CONSTRAINT "REL_1bec484614bbde7e66eb66018a"`);
        await queryRunner.query(`ALTER TABLE "videos" ADD CONSTRAINT "FK_1bec484614bbde7e66eb66018ae" FOREIGN KEY ("contentsId") REFERENCES "contents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos" DROP CONSTRAINT "FK_1bec484614bbde7e66eb66018ae"`);
        await queryRunner.query(`ALTER TABLE "videos" ADD CONSTRAINT "REL_1bec484614bbde7e66eb66018a" UNIQUE ("contentsId")`);
        await queryRunner.query(`ALTER TABLE "videos" ADD CONSTRAINT "FK_1bec484614bbde7e66eb66018ae" FOREIGN KEY ("contentsId") REFERENCES "contents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
