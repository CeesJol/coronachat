const {randomId} = require('./general');

const MAX_USER_SIZE = 5; // The default maximum amount of users in one room

class Rooms {
  constructor() {
    this.rooms = [];

    // Add a General and Development room
    this.addRoom("Algemeen 👩‍💻", true);
    this.addRoom("App Ontwikkeling 🏗", true);
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
  addRoom(name, invincible, maxSize) {
    var id = this.createId();
    var room = {
      id: id, 
      users: [],
      name: name || 'Kamer ' + id,
      invincible: invincible || false,
      maxSize: maxSize || MAX_USER_SIZE
    };
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
    for (var room of this.rooms) {
      for (var user of room.users) {
        if (user.id === userId) {
          return room;
        }
      }
    }

    return undefined;
  }

  getRoomAndUser(userId) {
    for (var room of this.rooms) {
      for (var user of room.users) {
        if (user.id === userId) {
          return {room, user};
        }
      }
    }

    return {undefined, undefined};
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

    if (room.users.length >= room.maxSize) return false;

    room.users.push(user);

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

          return user;
        }
      }
    }
  }

  shadowBanUser(userId) {
    for (var i = 0; i < this.rooms.length; i++) {
      var room = this.rooms[i];
      for (var j = 0; j < room.users.length; j++) {
        var user = room.users[j];
        if (user.id == userId) {
          user.shadowBanned = true;

          return user;
        }
      }
    }
  }

  // Find the best room for a user to join
  // Note that in the server, the rooms are sorted on number of users every interval.
  findBestRoom() {
    for (var room of this.rooms) {
      if (room.users.length < room.maxSize) {
        return room;
      }
    }

    return this.addRoom();   // All rooms are full/closed, make a new room
  }

  // Clean rooms
  // Aim to always have one empty room
  clean() {
    if (this.rooms.length == 0) return;

    var fullRooms = 0;
    var emptyRooms = 0;

    this.rooms = this.rooms.filter((room) => {
      if (room.users.length > 0 || room.invincible == true) {
        if (room.users.length >= room.maxSize - 1) fullRooms++;
        return true;
      } else {
        if (emptyRooms++ > 0) return false;
      }
    });

    // If there is no available room, add one
    if (fullRooms == this.rooms.length) this.addRoom();
  }

  // Sort the rooms based on number of users, or otherwise their id
  sort() {
    this.rooms.sort((room1, room2) => {
      var userDiff = room2.users.length - room1.users.length;
      if (userDiff !== 0) {
        return userDiff;
      } else {
        return room1.id - room2.id;
      }
    });
  }
};

module.exports = {Rooms};