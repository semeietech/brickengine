function gameFactory({ screen, combine, control },...scenes) {
    console.log('on game factory')
    function game({ characters, transictions, loop, injection: { getAllShapesPieces }, getState }){
      const state = '1'
      console.log({state})
      // transição
      //const gameTransictions = transictions.reduce((fns, fn) => [...fns, fn(scenes)], [])
      // const goToLoop = gameTransictions.reduce(
      //   (acc, fn) => [...acc, fn(state)],
      //   [],
      // ).reduce(
      //   (stay, toGo) => typeof toGo !== 'boolean' && 
      //     typeof stay === true ?
      //     toGo :
      //     stay,
      //   true,
      // )
      
      if (true) {
        screen(
          combine(
            getAllShapesPieces(state)
          )
        )
        
      }
      // restart game
      return game(scenes[0])
    }
    return {
      start: () => game(scenes[0]),
      restart: () => game(scenes[0]),
      pause: () => 1,
    }
}

export default gameFactory
