'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Courses');

    // If old column exists and new one doesn't, rename it
    if (tableInfo.order && !tableInfo.orderIndex) {
      await queryInterface.renameColumn('Courses', 'order', 'orderIndex');
    }

    // If neither exists (fresh schema), add orderIndex and backfill from id
    if (!tableInfo.order && !tableInfo.orderIndex) {
      await queryInterface.addColumn('Courses', 'orderIndex', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      });
      // Backfill so that existing rows get a deterministic order (e.g., their id)
      await queryInterface.sequelize.query(`
        UPDATE "Courses"
        SET "orderIndex" = "id"
        WHERE "orderIndex" = 0 OR "orderIndex" IS NULL
      `);
    }

    // If orderIndex exists but is null/zero for some rows, backfill those from id
    if (tableInfo.orderIndex) {
      await queryInterface.sequelize.query(`
        UPDATE "Courses"
        SET "orderIndex" = "id"
        WHERE ("orderIndex" = 0 OR "orderIndex" IS NULL)
      `);
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Courses');

    // Reverse: if orderIndex exists and order does not, rename it back
    if (tableInfo.orderIndex && !tableInfo.order) {
      await queryInterface.renameColumn('Courses', 'orderIndex', 'order');
    }

    // If only orderIndex exists (and you had created it fresh), remove it
    if (tableInfo.orderIndex && tableInfo.order) {
      // Both exist; to avoid data loss do nothing automatic.
      // If you want to drop orderIndex manually, do it intentionally later.
    }
  },
};
