module.exports = (sequelize, DataTypes) => {
  const Playlist = sequelize.define(
    'Playlist',
    {
      user: DataTypes.STRING,
      saveData: DataTypes.JSON,
    },
    {},
  )
  Playlist.associate = function(models) {
    // associations can be defined here
  }
  return Playlist
}
