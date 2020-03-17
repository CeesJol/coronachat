const {User} = require('./user');
const {randomId} = require('./general');

const MAX_USER_SIZE = 2;          // Maximum amount of users in one room

class Rooms {

  // Set up Rooms list
  constructor() {
    this.rooms = [];
  }

  // Add a room
  addRoom(us) {
    var id = randomId();
    var users = us || [];
    var room = {id, users};
    this.rooms.push(room);

    console.log(' >> CREATED ROOM ' + room.id);

    return room;
  }

  // Remove a room
  removeRoom(id) {
    // Select the room to be removed
    var room = this.rooms.filter((room) => room.id === id)[0];

    // If the room exists, remove it from the array
    if (room) {
      this.rooms = this.rooms.filter((room) => room.id !== id);

      console.log(' << DELETED ROOM ' + room.id);
    }

    return room;
  }

  // Get a room
  getRoom(id) {
    // Select the room
    return this.rooms.filter((room) => room.id === id)[0];
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
    this.getRoom(roomId).users.push(user);

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

    // If the room is empty, remove it
    // TODO TEST THIS
    // if (room.users.length == 0) {
    //   this.removeRoom(room.id);
    // }

    // Return the removed user
    return cur;
  }

  // Find the best room for a user to join
  findBestRoom() {
    var bestRoom;

    for (var room of this.rooms) {
      if (room.users.length < MAX_USER_SIZE) {
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
};

module.exports = {Rooms};
