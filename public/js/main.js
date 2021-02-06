const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from url

const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
});

// Join Chatroom
socket.emit('joinroom',{username, room});

// Get room and users
socket.on('roomUsers',({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message',function(message){
    console.log(message);
    outputMessage(message);

    // Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('messageb',function(message){
    console.log(message);
    outputMessage(message);

    // Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

socket.on('messaged',function(message){
    console.log(message);
    outputMessage(message);

    // Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Message submit
chatForm.addEventListener('submit',function(e){
    e.preventDefault();
    let msg = document.getElementById('msg');
    msg=msg.value;
    // pass on the msg value to the server
    socket.emit('chatMessage',msg);
    // Clear Input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta"> ${message.username}<span> ${message.time} </span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users){
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
};

