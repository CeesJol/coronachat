
class User {
  constructor(id, name, roomId) {
    this.id = id;
    this.name = name;
    this.roomId = roomId;
    this.admin = false;
    this.shadowBanned = false;
  }
};

module.exports = {User};
