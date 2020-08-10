import express from "express";
import socketio from "socket.io";
import http from 'http'
import path from "path";
import { World, Vec2, Body, Fixture } from 'planck-js';
// Wrongly typed :(
// @ts-ignore
import { Circle, Edge, Polygon } from 'planck-js'
//import io from 'socket.io'

const expressApp = express();
expressApp.set("port", process.env.PORT || 3000);

let httpServer = new http.Server(expressApp);
// set up socket.io and bind it to our
// http server.

expressApp.use(express.static('airhockey_client/dist'))

let io = socketio(httpServer)


let playerPos = {
  a: {x:0, y:0},
  b: {x:0, y:0}
}

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected

io.on("connection", function(socket: socketio.Socket) {
  console.log("a user connected");
  socket.on('cursor move', msg => {
    if(msg.playerA) {
      playerPos.a = msg
    } else {
      playerPos.b = msg
    }
  })
  socket.on('reset position', () => {
    scoreListener('')
    socket.emit('reset position')
  })
});

const server = httpServer.listen(3000, function() {
  console.log("listening on *:3000");
});

let scale = 10

let scoreA = 0
let scoreB = 0

let app = {
  view: {
    width: 1920,
    height: 1080,
  }
}

var world = new World({
  gravity: Vec2(0, 0)
})

let leftScoreFixture: Fixture;
let rightScoreFixture: Fixture;

function addWalls() {
  let center = world.createBody().setStatic()
  center.setPosition(Vec2((app.view.width / 2) / scale, 0))
  let centerFixture = center.createFixture(Edge(Vec2(0, 0), Vec2(0, app.view.height / scale)), {
    restitution: 0
  } as any)
  centerFixture.setFilterData({
    categoryBits: 8,
    maskBits: 2,
    groupIndex: 4
  })

  let top = world.createBody().setStatic()
  top.setPosition(Vec2(0, (app.view.height * 0.97) / scale))
  let topFixture = top.createFixture(Edge(Vec2(0, 0), Vec2(app.view.width / scale, 0)), {
    restitution: 1
  } as any)
  topFixture.setFilterData({
    categoryBits: 1,
    maskBits: 0xFFFF,
    groupIndex: 1
  })

  let bottom = world.createBody().setStatic()
  bottom.setPosition(Vec2(0, (app.view.height * 0.03) / scale))
  let bottomFixture = bottom.createFixture(Edge(Vec2(0, 0), Vec2(app.view.width / scale, 0)), {
    restitution: 1
  } as any)
  bottomFixture.setFilterData({
    categoryBits: 1,
    maskBits: 0xFFFF,
    groupIndex: 1
  })

  let left1 = world.createBody().setStatic()
  left1.setPosition(Vec2((app.view.width * 0.02) / scale, 0))
  let left1Fixture = left1.createFixture(Edge(Vec2(0, 0), Vec2(0, (app.view.height * 0.35) / scale)), {
    restitution: 1
  } as any)
  left1Fixture.setFilterData({
    categoryBits: 1,
    maskBits: 0xFFFF,
    groupIndex: 1
  })

  let left2 = world.createBody().setStatic()
  left2.setPosition(Vec2((app.view.width * 0.02) / scale, 0))
  let left2Fixture = left2.createFixture(Edge(Vec2(0, (app.view.height * 0.65) / scale), Vec2(0, app.view.height / scale)), {
    restitution: 1
  } as any)
  left2Fixture.setFilterData({
    categoryBits: 1,
    maskBits: 0xFFFF,
    groupIndex: 1
  })

  let right1 = world.createBody().setStatic()
  right1.setPosition(Vec2((app.view.width * 0.98) / scale, 0))
  let right1Fixture = right1.createFixture(Edge(Vec2(0, 0), Vec2(0, (app.view.height * 0.35) / scale)), {
    restitution: 1
  } as any)
  right1Fixture.setFilterData({
    categoryBits: 1,
    maskBits: 0xFFFF,
    groupIndex: 1
  })

  let right2 = world.createBody().setStatic()
  right2.setPosition(Vec2((app.view.width * 0.98) / scale, 0))
  let right2Fixture = right2.createFixture(Edge(Vec2(0, (app.view.height * 0.65) / scale), Vec2(0, app.view.height / scale)), {
    restitution: 1
  } as any)
  right2Fixture.setFilterData({
    categoryBits: 1,
    maskBits: 0xFFFF,
    groupIndex: 1
  })

  let leftScore = world.createBody().setStatic()
  leftScore.setPosition(Vec2((app.view.width * -0.25 + app.view.width * -0.0375) / scale, 0))
  leftScoreFixture = leftScore.createFixture(Polygon([Vec2(0, 0), Vec2((app.view.width * 0.25) / scale, 0), Vec2((app.view.width * 0.25) / scale, app.view.height / scale), Vec2(0, app.view.height / scale)]), {
    isSensor: true
  } as any)
  //leftScoreFixture.setSensor(true)

  let leftScoreBlock = world.createBody().setStatic()
  leftScoreBlock.setPosition(Vec2(0, 0))
  let leftScoreBlockFixture = leftScoreBlock.createFixture(Edge(Vec2(0, 0), Vec2(0, app.view.height / scale)), {
    restitution: 0
  } as any)
  leftScoreBlockFixture.setFilterData({
    categoryBits: 8,
    maskBits: 2,
    groupIndex: 4
  })

  let rightScore = world.createBody().setStatic()
  rightScore.setPosition(Vec2((app.view.width * 1.0375) / scale, 0))
  rightScoreFixture = rightScore.createFixture(Polygon([Vec2(0, 0), Vec2((app.view.width * 0.25) / scale, 0), Vec2((app.view.width * 0.25) / scale, app.view.height / scale), Vec2(0, app.view.height / scale)]), {
    isSensor: true
  } as any)
  //rightScoreFixture.setSensor(true)

  let rightScoreBlock = world.createBody().setStatic()
  rightScoreBlock.setPosition(Vec2((app.view.width / scale), 0))
  let rightScoreBlockFixture = rightScoreBlock.createFixture(Edge(Vec2(0, 0), Vec2(0, app.view.height / scale)), {
    restitution: 0
  } as any)
  rightScoreBlockFixture.setFilterData({
    categoryBits: 8,
    maskBits: 2,
    groupIndex: 4
  })

  return [top, bottom, left1, left2, right1, right2, center]
}

function createPlayer(radius: number, pos: Vec2) {
  let body = world.createBody().setKinematic()
  body.setPosition(pos)
  let bodyFixture = body.createFixture(Circle(radius), {
    density: 5
  } as any)
  bodyFixture.setFilterData({
    categoryBits: 2,
    maskBits: 0xFFFF,
    groupIndex: 2
  })
  return body
}

function setPlayerPosition(player: Body, to: Vec2, correction = true, multiplier = 100) {
  let pos = player.getWorldCenter()
  let diff = to.sub(pos)
  if ((Math.abs(diff.x) > 8 || Math.abs(diff.y) > 8) && correction) {
    player.setPosition(player.getWorldCenter().add(diff.mul(2 / 3)))
  }
  diff.mul(multiplier)
  player.setLinearVelocity(diff)
  player.setAngularVelocity(0)
}

function createBall() {
  let body = world.createBody().setDynamic()
  body.setPosition(Vec2((app.view.width / 2) / scale, (app.view.height / 2) / scale))
  let bodyFixtureDef = {
    friction: 0.01,
    density: 1,
    restitution: 0,
    filterCategoryBits: 16
  }
  body.createFixture(Circle((app.view.width * 0.025) / scale), bodyFixtureDef as any)

  return body;
}

// Player A
let playerA = createPlayer((app.view.width * 0.04375) / scale, Vec2((app.view.width * 0.25) / scale, (app.view.height / 2) / scale))
// Player B
let playerB = createPlayer((app.view.width * 0.04375) / scale, Vec2((app.view.width * 0.85) / scale, (app.view.height / 2) / scale))

// Add walls
let walls = addWalls()

// Add ball
let ball = createBall()

let scoreListener = (player: string) => {
  if (player == 'A') {
    scoreA++
    io.emit('score', {
      playerA: true,
      score: {
        a: scoreA,
        b: scoreB
      }
    })
  } else if (player == 'B') {
    scoreB++
    io.emit('score', {
      playerA: false,
      score: {
        a: scoreA,
        b: scoreB
      }
    })
  }
  playerPos = {
    a: {
      x: app.view.width * 0.25,
      y: app.view.height / 2
    },
    b: {
      x: app.view.width * 0.75,
      y: app.view.height / 2
    }
  }
  ball.setPosition(Vec2((app.view.width / 2) / scale, (app.view.height / 2) / scale))
  ball.setLinearVelocity(Vec2(0, 0))
  playerA.setPosition(Vec2((app.view.width * 0.25) / scale, (app.view.height / 2) / scale))
  playerB.setPosition(Vec2((app.view.width * 0.85) / scale, (app.view.height / 2) / scale))
}

let now = Date.now()

setInterval(() => {
  let elapsedMS = Date.now() - now
  world.step(1 / 60, elapsedMS / 1000);
  setPlayerPosition(playerA, Vec2(playerPos.a.x / scale, playerPos.a.y / scale), true, 3)
  setPlayerPosition(playerB, Vec2(playerPos.b.x / scale, playerPos.b.y / scale), true, 3)

  if (world.getContactCount() > 0) {
    let fixtureA = world.getContactList()?.getFixtureA()
    let fixtureB = world.getContactList()?.getFixtureB()
    if (fixtureA == leftScoreFixture) {
      if (fixtureB == ball.getFixtureList()) {
        scoreListener('B')
      }
    } else if (fixtureA == ball.getFixtureList()) {
      if (fixtureB == leftScoreFixture) {
        scoreListener('B')
      }
    }
    if (fixtureA == rightScoreFixture) {
      if (fixtureB == ball.getFixtureList()) {
        scoreListener('A')
      }
    } else if (fixtureA == ball.getFixtureList()) {
      if (fixtureB == rightScoreFixture) {
        scoreListener('A')
      }
    }
  }
  io.emit('simulation-updated', {
    ball: ball.c_position.c,
    playerA: playerA.c_position.c,
    playerB: playerB.c_position.c
  })
}, 1 / 60)
