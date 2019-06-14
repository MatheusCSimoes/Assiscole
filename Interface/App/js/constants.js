myApp
 
.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
 
.constant('USER_ROL', {
  admin: '1', //Puede hacer de todo
  rector: '2', //Puede hacer de todo igual que el Administrador
  coordinador: '3', //Puede hacer de todo menos borrar estudiantes
  profesor: '4', //Solo puede mirar, no puede enviar
  promocion: '5', //Solo es para promover los estudiantes
  nada: '6'
});