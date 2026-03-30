import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenHash1774608827725 implements MigrationInterface {
    name = 'AddRefreshTokenHash1774608827725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "refreshTokenHash" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refreshTokenHash"`);
    }

}
