function stateFactory({ name, ...props }) {
    return ({
      gameName: name,
      gameClass: 'state',
      ...props
    })
}

export default stateFactory
