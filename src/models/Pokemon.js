const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo pokemon
// Luego le injectamos la conexion a sequelize.
// Un MODELO es una abstracción que representa una TABLA de nuestra base de datos
module.exports = (sequelize) => {
                                        //defino el modelo con sus atributos a través del metodo .define()
  sequelize.define('pokemon', {         //1º argumento: nombre del modelo //2º argumento: objeto con propiedades //3º argumento: timestamps
    id: {
      type: DataTypes.UUID,             //UUID genera un codigo random único con letras y numeros. DataType de Sequelize(Universal Unique Identifier)
      defaultValue: DataTypes.UUIDV4,   //valor por default UUIDV4 que es un standard
      allowNull: false,                 //no puede ser null
      primaryKey: true,                 
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,           //URL
    },
    health: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    attack: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    defense: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    speed: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdInDb: {                  //prop que me va a permitir acceder solo a los pokemons creados en la db
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,           //se añade automaticamente a cada pokemon creado
    }

  });                              //{timestamps: false} si no quiero que aparezcan createdAt ni updatedAt en la db
};


//Luego de definir un modelo, éste estará disponible a través del método sequelize.models() importado como propiedad.