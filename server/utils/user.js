
class User {
  constructor(id, name, roomId) {
    this.id = id;
    this.name = name;
    this.roomId = roomId;
    this.admin = false;
  }
};

module.exports = {User};
