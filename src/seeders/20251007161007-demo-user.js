'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        firstname: 'John',
        lastname: 'Doe',
        email: 'example@example.com',
        phonenumber:"0906031146",
        password:"lem@19072006",
        roleid:1,
        address:"Hai Phong- An Duong",
        budget:200,
        createdat: new Date(),
        updatedat: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    //return queryInterface.bulkDelete('Users', null, {});
  },
};
