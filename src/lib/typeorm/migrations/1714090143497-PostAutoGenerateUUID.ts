import { MigrationInterface, QueryRunner } from 'typeorm'

export class PostAutoGenerateUUID1714090143497
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `)

    await queryRunner.query(
      `ALTER TABLE post
       ALTER COLUMN id SET DEFAULT uuid_generate_v4();
      `,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE post
       ALTER COLUMN id DROP DEFAULT;
      `,
    )
  }
}