const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class CreateTransactionTable1707530045480 {
    name = 'CreateTransactionTable1707530045480'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from" character varying NOT NULL, "to" character varying NOT NULL, "hexValue" character varying NOT NULL, "hexBlockNumber" character varying NOT NULL, "value" character varying NOT NULL, "blockNumber" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "transaction"`);
    }
}
