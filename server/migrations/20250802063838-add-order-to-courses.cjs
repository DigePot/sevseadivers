'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Courses');
    if (!tableInfo.order) {
      await queryInterface.addColumn('Courses', 'order', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      });
    }

    await queryInterface.sequelize.query(`
      UPDATE "Courses"
      SET "order" = "id"
      WHERE "order" IS NULL OR "order" = 0
    `);
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Courses');
    if (tableInfo.order) {
      await queryInterface.removeColumn('Courses', 'order');
    }
  },
};
