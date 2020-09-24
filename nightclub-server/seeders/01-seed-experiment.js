module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Playlists',
      [
        {
          user: 'User 1',
          saveData: JSON.stringify([{bpm:40, song:'hello'}]),
          createdAt: new Date('August 19, 2019 23:15:30'),
          updatedAt: new Date('August 19, 2019 23:15:30'),
        },
        {
          user: 'User 2',
          saveData: JSON.stringify([{bpm:40, song:'hello'}, {bpm:40, song:'hello hello'}]),
          createdAt: new Date('August 19, 2019 23:15:30'),
          updatedAt: new Date('August 19, 2019 23:15:30'),
        },
      ],
      {},
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Playlists', null, {})
  },
}
