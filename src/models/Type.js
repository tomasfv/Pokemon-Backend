const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo type
// Luego le injectamos la conexion a sequelize.
// Un MODELO es una abstracción que representa una TABLA de nuestra base de datos
module.exports = (sequelize) => {
  // defino el modelo
  //ID lo genera sequelize de manera automatica.
  sequelize.define('type', {
    name:{                            //atributo name es el nombre de cada tipo de pokemon
        type: DataTypes.STRING
    }
  })}

//Luego de definir un modelo, éste estará disponible a través del método sequelize.models() importado como propiedad.
