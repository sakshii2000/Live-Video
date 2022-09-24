const express = require('express');
// const ejs = require('ejs');
const app = express();

const server = require('http').Server(app)
const io = require('socket.io')(server)

const { v4: uuidv4 } = require('uuid');

app.set('view engine', 'ejs')
app.use(express.static('public'))


app.get('/', (req,res) => {
  res.redirect(`/${uuidv4()}`)
})

app.get('/:room', function(req,res){
  // console.log(req.params.room);
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)

    socket.on('disconnect' ,() => {
      socket.to(roomId).emit('user-disconnected', userId)
    })
  })
})

server.listen(3000,function(){
  console.log("App running on 3000");
})
