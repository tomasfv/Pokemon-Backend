require('dotenv').config();
const { Sequelize } = require('sequelize');			//importo el modulo de sequelize.
const fs = require('fs');
const path = require('path');
const { DB_USER, DB_PASSWORD, DB_HOSTPG, DB_NAME, DB_DATABASE, DB_PORT } = process.env;
//DEPLOY
let sequelize =
	// process.env.NODE_ENV === 'production'
	// 	? new Sequelize({
	// 			database: DB_NAME,
	// 			dialect: 'postgres',
	// 			host: DB_HOSTPG,
	// 			port: 6224,
	// 			username: DB_USER,
	// 			password: DB_PASSWORD,
	// 			pool: {
	// 				max: 3,
	// 				min: 1,
	// 				idle: 10000,
	// 			},
	// 			dialectOptions: {
	// 				ssl: {
	// 					require: true,
	// 					// Ref.: https://github.com/brianc/node-postgres/issues/2009
	// 					rejectUnauthorized: false,
	// 				},
	// 				keepAlive: true,
	// 			},
	// 			ssl: true,
	// 	  }) :
		new Sequelize(
				// `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/pokemon`,		//datos del .env. Logging
				`postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOSTPG}:${DB_PORT}/${DB_DATABASE}`,
				{ logging: false, native: false }
		  );

// const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/pokemon`, {
//   logging: false, // set to console.log to see the raw SQL queries
//   native: false, // lets Sequelize know we can use pg-native for ~30% more speed
// });
//DEPLOY---------------------------------------------------------------------------------------------------------
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades (Pokemon y Type)
// Para relacionarlos hacemos un destructuring (traemos los modelos de sequelize)
const { Pokemon, Type } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);
//genero la tabla intermedia "pokemon_type" que tendra solo el id del pokemon y el id del tipo relacionados:
Type.belongsToMany(Pokemon, {through: "pokemon_type"}); 
Pokemon.belongsToMany(Type, {through: "pokemon_type"});


module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importar la conexión { conn } = require('./db.js');
};
