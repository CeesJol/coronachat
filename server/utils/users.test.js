// const expect = require('expect');

// const {Users} = require('./users');

// describe('Users', () => {
//   var users;

//   beforeEach(() => {
//     users = new Users();
//     users.users = [{
//       id: '1',
//       name: 'Mike',
//       room: 'Node course'
//     }, {
//       id: '2',
//       name: 'Jen',
//       room: 'React course'
//     }, {
//       id: '3',
//       name: 'Julie',
//       room: 'Node course'
//     }];
//   });

//   it('should remove a user', () => {
//     var user = users.removeUser('3');

//     expect(users.users.length).toEqual(2);
//   });

//   it('should not remove user', () => {
//     var user = users.removeUser('99');

//     expect(users.users.length).toEqual(3);
//   });

//   it('should find a user', () => {
//     var user = users.getUser('1');

//     expect(user.name).toEqual('Mike');
//   });

//   it('should not find user', () => {
//     var user = users.getUser('99');

//     expect(user.name).toNotExist();
//   });

//   it('should add new user', () => {
//     var users = new Users();
//     var user = {
//       id: '123', 
//       name: 'Cees',
//       room: 'cheese'
//     }
//     var resUser = users.addUser(user.id, user.name, user.room);

//     expect(users.users).toEqual([user]);
//   });

//   it('should return names for node course', () => {
//     var userList = users.getUserList('Node course');

//     expect(userList).toEqual(['Mike', 'Julie']);
//   });
// });