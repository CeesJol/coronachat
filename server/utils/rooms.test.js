const expect = require('expect');

const {Rooms} = require('./rooms');
const {User} = require('./user');

describe('Rooms', () => {
  var rooms;
  var user;
  var roomId = 100;
  var mike = new User(1, 'Mike', roomId);
  var john = new User(2, 'John', roomId);

  beforeEach(() => {
    rooms = new Rooms();

    rooms.rooms = [{
      id: roomId,
      users: [],
      maxSize: 42
    }, {
      id: roomId + 1,
      users: [mike, john],
      maxSize: 42
    }];

    user = new User(2, 'Katie', roomId);
  });

  it('should add a room with users', () => {
    var rooms = new Rooms();
    var resRoom = rooms.addRoom();
    rooms.addUser(resRoom.id, user);

    expect(resRoom.users).toEqual([user]);
  });
  it('should add a room without users', () => {
    var rooms = new Rooms();
    var resRoom = rooms.addRoom();

    expect(resRoom.users).toEqual([]);
  });

  it('should remove a room', () => {
    var startLength = rooms.rooms.length;
    var resRoom = rooms.removeRoom(roomId);

    // Did the right room get removed?
    expect(resRoom.id).toEqual(roomId);

    // Is the room actually removed?
    expect(rooms.rooms.length).toEqual(startLength - 1);
  });
  it('should not remove room', () => {
    var startLength = rooms.rooms.length;
    var noRoom = rooms.removeRoom(90011009);

    // Is the room undefined?
    // Note: toBeFalsy is what toNotExist() was
    expect(noRoom).toBeFalsy();

    // Is no room removed?
    expect(rooms.rooms.length).toBe(startLength);
  });

  it('should get user', () => {
    var user = rooms.getUser(2);

    expect(user).toEqual(john);
  });
  it('should not get user', () => {
    var user = rooms.getUser(42);

    expect(user).toEqual(undefined);
  });

  it('should find room', () => {
    var room = rooms.getRoom(roomId);

    expect(room).toEqual(rooms.rooms[0]);

    expect(room.id).toEqual(roomId);
  });

  it('should return list of users', () => {
    var users = rooms.getUsers(roomId);

    expect(users).toEqual(rooms.rooms[0].users);
  });
  it('nonexisting room: should return list of users', () => {
    var users = rooms.getUsers(1337);

    expect(users).toEqual([]);
  });

  it('should add the user', () => {
    var user = new User(3, 'Cees', roomId);

    rooms.addUser(roomId, user);

    expect(rooms.rooms[0].users).toEqual([user]);
  });
  it('should not add the user', () => {
    var user = new User(3, 'Cees', roomId);

    rooms.addUser(1337, user);

    expect(rooms.rooms[0].users).toEqual([]);
  });

  it('should remove the user', () => {
    var startLength = rooms.rooms[1].users.length;

    var user = rooms.rooms[1].users[0]; 

    var resUser = rooms.removeUser(1);

    // Did the right user get removed?
    expect(resUser).toEqual(user);

    // Is the user actually removed?
    expect(rooms.rooms[1].users.length).toEqual(startLength - 1);
  });
  it('should not remove the user', () => {
    var startLength = rooms.rooms[1].users.length;

    var user = new User(42, 'Nonexisting', 1337); 

    var resUser = rooms.removeUser(user.id);

    // Did the function return undefined? (.toBeUndefined() doesnt work for me)
    expect(resUser).toEqual(undefined);

    // Is no user removed?
    expect(rooms.rooms[1].users.length).toEqual(startLength);
  });

  it('should find best room', () => {
    // Add user to first room
    var user = new User(3, 'Cees', roomId);
    rooms.addUser(roomId, user);

    var bestRoom = rooms.findBestRoom();

    expect(bestRoom).toEqual(rooms.rooms[0]);
  });

  it('should find the room of the user', () => {
    var room = rooms.getRoomOfUser(1);

    expect(room.id).toEqual(roomId + 1);
  });

  it('should clean some rooms', () => {
    var rooms = new Rooms();

    var startLength = rooms.rooms.length;
    
    for (var i = 0; i < 5; i++) {
      rooms.addRoom();
    }

    rooms.clean();

    expect(rooms.rooms.length).toEqual(startLength);
  });

  it('should clean no rooms, because there are users', () => {
    var rooms = new Rooms();

    var startLength = rooms.rooms.length;
    
    for (var i = 0; i < 5; i++) {
      var newRoom = rooms.addRoom();
      rooms.addUser(newRoom.id, mike);
    }

    rooms.clean();

    expect(rooms.rooms.length).toEqual(5 + startLength);
  });

  it('should clean no rooms, because they are invincible', () => {
    var rooms = new Rooms();

    var startLength = rooms.rooms.length;
    
    for (var i = 0; i < 5; i++) {
      rooms.addRoom('some name', true);
    }

    rooms.clean();

    expect(rooms.rooms.length).toEqual(5 + startLength);
  });

  // Complicated test!
  // - findBestRoom
  // - addUser
  // - removeUser
  it('complicated test', () => {
    var rooms = new Rooms();

    var res1 = rooms.findBestRoom();
    var res2 = rooms.findBestRoom();
    var res3 = rooms.findBestRoom();

    var user1 = new User(3, 'Cees', res1.id);
    var user2 = new User(4, 'Ceessie', res2.id);
    var user3 = new User(5, 'Ceenon', res3.id);
    var unassignedUser = new User(6, 'Oof', 0);
    
    rooms.addUser(res1.id, user1);
    rooms.addUser(res2.id, user2);
    rooms.addUser(res3.id, user3);

    rooms.removeUser(user2.id);
    rooms.removeUser(unassignedUser.id);

    var nUsers = 0;
    for (var room of rooms.rooms) {
      nUsers += room.users.length;
    }

    expect(nUsers).toEqual(2);
  });

  it('should sort the rooms based on number of users', () => {
    rooms.sort();

    expect(rooms.rooms[0].users.length).toEqual(2);
  });

  it('should get room and user', () => {
    var {room, user} = rooms.getRoomAndUser(2);

    expect(user).toEqual(john);
    expect(room).toEqual(rooms.rooms[1]);
  });
});
