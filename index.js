//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = require('./src/app.js');
const { conn } = require('./src/db.js');      //importo la conexión sequelize

// Syncing all the models at once.
conn.sync({ force: true }).then(() => {       //.sync() sincroniza los modelos con la db  //true por default, false para el deploy
  // server.listen(process.env.PORT || 3001, () => {  //puerto 3001 para el back y db         //DEPLOY
    server.listen(3001, () => {  //puerto 3001 para el back y db         
    console.log('%s listening at 3001'); // eslint-disable-line no-console
  });
});


//Model.sync({force: true}): elimina (drop) la tabla y luego la vuelve a crear