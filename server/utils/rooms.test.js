const expect = require('expect');

const {Rooms} = require('./rooms');
const {User} = require('./user');

describe('Rooms', () => {
  var rooms;
  var user;
  var roomId = 100;

  beforeEach(() => {
    rooms = new Rooms();

    rooms.rooms = [{
      id: roomId,
      users: []
    }, {
      id: roomId + 1,
      users: [new User(1, 'Mike', roomId)],
    }];

    user = new User(2, 'Katie', roomId);
  });

  it('should add a room with users', () => {
    var rooms = new Rooms();
    var room = {
      users: [user]
    };
    var resRoom = rooms.addRoom(room.users);

    expect(rooms.rooms[0].users).toEqual(room.users);
  });
  it('should add a room without users', () => {
    var rooms = new Rooms();
    var room = {
      users: []
    };
    var resRoom = rooms.addRoom();

    expect(rooms.rooms[0].users).toEqual(room.users);
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

  it('should find room', () => {
    var room = rooms.getRoom(roomId);

    expect(room).toEqual(rooms.rooms[0]);

    expect(room.id).toEqual(roomId);
  });

  it('should return list of users', () => {
    var users = rooms.getUsers(roomId);

    expect(users).toEqual(rooms.rooms[0].users);
  });

  it ('should add the user', () => {
    var user = new User(3, 'Cees', roomId);

    rooms.addUser(roomId, user);

    expect(rooms.rooms[0].users).toEqual([user]);
  });

  // it('should get the user', () => {
  //   var startLength = rooms.rooms[0].users.length;

  //   var user = rooms.rooms[0].users[0];

  //   var resUser = rooms.removeUser(1);

  //   // Did we select the right user?
  //   expect(resUser).toEqual(user);
  // });

  it ('should remove the user', () => {
    var startLength = rooms.rooms[1].users.length;

    var user = rooms.rooms[1].users[0];

    console.log('user is ' + user);

    var resUser = rooms.removeUser(1);

    // Did the right user get removed?
    expect(resUser).toEqual(user);

    // Is the user actually removed?
    expect(rooms.rooms[1].users.length).toEqual(startLength - 1);
  });

  it('should find best room', () => {
    var bestRoom = rooms.findBestRoom();

    expect(bestRoom).toEqual(rooms.rooms[0]);
  });

  it('should find the room of the user', () => {
    var room = rooms.getRoomOfUser(1);

    expect(room.id).toEqual(roomId + 1);
  });
});
