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
    return this.getRoom(id).users;
  }

  // Add a user to a room
  addUser(roomId, user) {
    var room = this.getRoom(roomId);

    room.users.push(user);

    if (room.users.length >= MAX_USER_SIZE) {
      room.open = false;
    }

    this.userCount++;

    return user;
  }

  // Get a user from a room
  getUser(userId) {
    // Find the user's room
    var room = this.getRoomOfUser(userId);

    if (!room) return undefined;

    // Select the users
    var users = this.getUsers(room.id);

    // Select the user from this room
    var cur = users.filter((user) => user.id === userId)[0];

    return cur;
  }

  // Remove a user from a room
  // TODO remove the room if empty?
  removeUser(userId) {
    // Find the user's room
    var room = this.getRoomOfUser(userId);

    // Select the users
    var users = this.getUsers(room.id);

    // Select the user from this room
    var cur = users.filter((user) => user.id === userId)[0];

    // If the user exists, remove it from the array
    if (cur) {
      room.users = room.users.filter((user) => user.id !== userId);
    }

    // If the room is now empty, close it
    if (room.users.length == 0) {
      room.open = false;
    }

    this.userCount--;

    // Return the removed user
    return cur;
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

      // We found a room, return it
      return bestRoom;
    } else {

      // All rooms are full, make a new room
      return this.addRoom();
    }
  }

  // Clean rooms
  clean() {
    this.rooms = this.rooms.filter((room) => room.users.length > 0);
  }
};

module.exports = {Rooms};
