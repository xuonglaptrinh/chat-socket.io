"use strict";

module.exports = function (httpServer){
	var io = require('socket.io').listen(httpServer);

	var chatSocket = io.of('chat'),
		listUsers = [];

	chatSocket.on('connection', function (socket){
		console.log('socket connected '+ socket.id);

		socket.on('user:join', function (userInfo, callback){
			listUsers.push({
				username: userInfo.username,
				socketId: socket.id
			});
			
			socket.broadcast.emit('new:user', {
				username: userInfo.username,
				socketId: socket.id
			});
			callback(listUsers);
		});

		socket.on('send:message', function (data){
			if(data.to == ''){
				socket.broadcast.emit('new:message', data);
			}else {
				socket.to(data.to).emit('new:message', data);
			}
		})

		socket.on('disconnect', function (){
			listUsers.forEach(function (user){
				if(user.socketId == socket.id){
					socket.broadcast.emit('user:disconnect', user);
					listUsers.splice(listUsers.indexOf(user))	
				}
			})
			
		});



	});
};