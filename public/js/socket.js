$(document).ready(function (){
	var socket = io.connect('http://localhost:8080/chat'),
		username = '',
		users = [],
		messageBox = $("#messageBox"),
		listUsers = $("#listUser"),
		messageInput = $("#messageInput");

		username = prompt('Vui long nhap ten');

		socket.emit('user:join', {username: username}, function (users){
			users.forEach(function (value, key){
				listUsers.append('<option value='+value.socketId+'>'+value.username+'</option>');
			});
		});

		socket.on('new:user', function (userInfo){
			listUsers.append('<option value='+userInfo.socketId+'>'+userInfo.username+'</option>');
			messageBox.append('<p>New user : ' + userInfo.username + ' connect<p>');
		});
		socket.on('new:message', function (message){
			var str = '<div class="media">' +
					'<div class="media-body">' +
					'<b class="media-heading">' + message.from + '</b>'+
					'<p>' + message.content + '</p>' +
					'</div>'+
					'</div>';

			messageBox.append(str);
		})


		messageInput.keypress(function (event){
			if(event.keyCode == 13){
				socket.emit('send:message', {
					content: messageInput.val(),
					from: username,
					to: listUsers.val()
				});

				messageInput.val('');
			}
		});




		socket.on('user:disconnect', function (user){
			listUsers.find('option[value="'+ user.socketId+'"]').remove();
			messageBox.append('<p>User : ' + user.username + ' disconnected <p>');
		})




});