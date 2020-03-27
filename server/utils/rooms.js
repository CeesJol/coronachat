const {User} = require('./user');
const {randomId} = require('./general');

const MAX_USER_SIZE = 5; // Maximum amount of users in one room, duplicated at index.js
const MIN_ROOMS = 1; // Minimum number of rooms at all times

class Rooms {
  constructor() {
    this.rooms = [];

    for (var i = 1; i <= MIN_ROOMS; i++) {
      this.addRoom([], "Room " + i, true);
    }
  }

  // Create id
  createId() {
    if (this.getRoom(this.rooms.length + 1)) {
      // If a room already has this ID, find a unique ID
      var id;
      for (var i = 0; i < this.rooms.length; i++) {
        if (!this.getRoom(i + 1)) {
          id = '' + (i + 1);
          break;
        }
      }
      // As fallback, return a random id
      return id || randomId();
    } else {
      // Simply use the length + 1 as a new ID
      return '' + (this.rooms.length + 1);
    }
  }

  // Add a room
  addRoom(us, name, invincible) {
    var id = this.createId();
    var open = true;
    var users = us || [];
    var name = name || 'Room ' + id;
    var invincible = invincible || false;
    
    var room = {id, open, users, name, invincible};
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

    if (room.users.length >= MAX_USER_SIZE) return false;

    room.users.push(user);

    // if (room.users.length >= MAX_USER_SIZE) {
    //   room.open = false;
    // }

    return user;
  }

  // Get a user by their id
  getUser(userId) {
    for (var room of this.rooms) {
      for (var user of room.users) {
        if (user.id == userId) return user;
      }
    }

    return undefined;
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
          // if (room.users.length == 0) {
          //   room.open = false;
          // }

          return user;
        }
      }
    }
  }

  // Find the best room for a user to join
  // Note that in the server, the rooms are sorted on number of users every interval.
  findBestRoom() {
    var bestRoom;

    for (var room of this.rooms) {
      if (room.open && room.users.length < MAX_USER_SIZE) {
        bestRoom = room;
        break;
      }
    }

    if (bestRoom) {
      return bestRoom;         // We found a room, return it
    } else {
      return this.addRoom();   // All rooms are full/closed, make a new room
    }
  }

  // Clean rooms
  // Aim to always have one empty room (excluding the invincible rooms)
  clean() {
    var emptyRoom = 0;
    this.rooms = this.rooms.filter((room) => {
      if (room.users.length > 0 || room.invincible == true) {
        return true;
      } else if (emptyRoom < 1) {
        emptyRoom++;
        return true;
      } else {
        return false;
      }
    });

    // If there is no empty room, add one
    if (emptyRoom === 0) this.addRoom();
  }
};

module.exports = {Rooms, MAX_USER_SIZE, MIN_ROOMS};
