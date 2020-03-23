const {User} = require('./user');
const {randomId} = require('./general');

const MAX_USER_SIZE = 2; // Maximum amount of users in one room

class Rooms {
  constructor() {
    this.rooms = [];
    this.userCount = 0;
  }

  // Add a room
  addRoom(us) {
    var id = randomId();
    var open = true;
    var users = us || [];
    var room = {id, open, users};
    this.rooms.push(room);

    return room;
  }

  // Remove a room
  // NOTE: I use filter in the clean() function to remove rooms,
  // which means this function is currently not used.
  removeRoom(id) {
    // Select the room to be removed
    var room = this.rooms.filter((room) => room.id === id)[0];

    // If the room exists, remove it from the array
    if (room) {
      this.rooms = this.rooms.filter((room) => room.id !== id);
    }

    return room;
  }

  // Get a room
  getRoom(id) {
    // Select the room
    return this.rooms.filter((room) => room.id === id)[0];
  }

  // Get number of users
  numberOfUsers() {
    return this.userCount;
  }

  // Get a room of a user
  getRoomOfUser(userId) {
    var room = this.rooms.filter((room) => {
      return room.users.filter((user) => user.id === userId)[0];
    })[0];

    return room;
  }

  // Get a list of users of a room
  getUsers(id) {
    var room = this.getRoom(id);

    if (!room) return [];

    return room.users;
  }

  // Add a user to a room
  addUser(roomId, user) {
    var room = this.getRoom(roomId);

    if (!room) return undefined;

    room.users.push(user);

    if (room.users.length >= MAX_USER_SIZE) {
      room.open = false;
    }

    this.userCount++;

    return user;
  }

  // Get a user by their id
  getUser(userId) {
    var room = this.rooms.filter((room) => {
      return room.users.filter((user) => user.id === userId)[0];
    })[0];

    if (!room) return undefined;

    return room.users[0];
  }

  // Remove a user from a room
  removeUser(userId) {
    for (var i = 0; i < this.rooms.length; i++) {
      var room = this.rooms[i];
      for (var j = 0; j < room.users.length; j++) {
        var user = room.users[j];
        if (user.id == userId) {
          room.users.splice(j, 1);

          // If the room is now empty, close it
          if (room.users.length == 0) {
            room.open = false;
          }

          this.userCount--;

          return user;
        }
      }
    }
  }

  // Find the best room for a user to join
  findBestRoom() {
    var bestRoom;

    for (var room of this.rooms) {
      if (room.open && room.users.length < MAX_USER_SIZE && room.users.length > 0) {
        bestRoom = room;
        break;
      }
    }

    if (bestRoom) {
      return bestRoom;        // We found a room, return it
    } else {
      return this.addRoom();   // All rooms are full/closed, make a new room
    }
  }

  // Clean rooms
  clean() {
    this.rooms = this.rooms.filter((room) => room.users.length > 0);
  }
};

module.exports = {Rooms};
