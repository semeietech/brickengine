function sceneFactory(settings){
    const getAllShapesPieces = (state) => {
      const stateItems = Object.keys(settings.draw)
      const pieces = Object.keys(settings.characters).map(
        charName => settings.characters[charName].piece
      )
      return stateItems.map(
        stateName => settings.draw[stateName].unique ? 
          [pieces[stateName], state[stateName]] :
          state[stateName].reduce(
            (map, pos) =>[pieces[stateName], pos ],
        ),
      )
    }
    const getCharShapeAndPos = () => true
    const getCharData = () => true
    
    const injection = {
      getCharData,
      getCharShapeAndPos,
      getAllShapesPieces,
      updateScene,
    }
    
    return (updateScene) => {
      return ({
        gameName: settings.name,
        gameClass: 'scene',
        injection,
        characters: settings.chatacters,
        transictions: settings.transictions.reduce((fns, fn) => fn(injection), []),
        loop: (loopState) => settings.loop(injection)(loopState),
      })
    }
}

export default sceneFactory
