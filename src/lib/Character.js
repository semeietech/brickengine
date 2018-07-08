function characterFactory({ name, piece }) {
    return ({
      gameName: name,
      gameClass: 'character',
      piece,
    })
}

export default characterFactory
