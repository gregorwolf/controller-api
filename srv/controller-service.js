module.exports = cds.service.impl (srv => {

  srv.on('READ', 'XSAUsers', async (req) => {
    const srv = cds.connect.to('controller-config')
    const tx = srv.transaction(req)
    const response = await tx.get('/users')
    // try to query the users
    const users = [
      {
        username: "GWOLF"
      }
    ]
    return users;
  })

})