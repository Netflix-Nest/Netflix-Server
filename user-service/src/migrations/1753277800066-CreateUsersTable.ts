import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1753277800066 implements MigrationInterface {
    name = 'CreateUsersTable1753277800066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isDeleted" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isDeleted" SET NOT NULL`);
    }

}
