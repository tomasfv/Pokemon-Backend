const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const axios = require('axios');
const { Type, Pokemon } = require('../db');     //importo los modelos Type y Pokemon

const e = require('express');
//const Pokemon = require('../models/Pokemon');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
//FUNCIONES CONTROLADORAS: Me traen info (getApiInfo() de la Api, getDbInfo() de la db) 

const getApiInfo = async () => {                                                    //funcion asincrona
    const pokeUrl = []; 
    const apiUrl = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=60'); //obtengo el array results: [{name + url de los primeros 40}] 
    
    apiUrl.data.results.forEach(el => {                             
        pokeUrl.push(axios.get(el.url).then(resp => resp.data));    //pusheo el contenido de la url de c/pokemon(obj {name, id, img, etc})
    });

    const apiInfo = Promise.all(pokeUrl)    //Promise.all espera que todas las promesas se cumplan y si se da...
    .then(res => res.map(p => {             //toma la respuesta y mapea por cada pokemon la info necesaria
        const info = {
            id: p.id,
            name: p.name,
            img: p.sprites.other.dream_world.front_default,
            type: p.types.map(el => el.type.name),
            health: p.stats[0].base_stat,
            attack: p.stats[1].base_stat,
            defense: p.stats[2].base_stat,
            speed: p.stats[5].base_stat,
            height: p.height,
            weight: p.weight,
        }
        return info;                        //devuelve toda la info
    }))
    return await apiInfo;                   //espera a que apiInfo reciba toda la info y cuando termina getApiInfo() devuelve esa const si la ejecutamos
}

const getDbInfo = async () => {             //función asincrona
    return await Pokemon.findAll({          //traeme todos los pokemon y ademas... (el metodo de sequelize .findAll se usa para pedir toda la info de mi tabla pokemon en la db)
        include: {                          //la opcion include se usa para pedir info de varios modelos a la vez. (Eager Loading)
            model: Type,                    //...incluí el modelo Tipo con atributo nombre
            attributes: ['name'],
            through: {                      //"mendiante los atributos" (comprobacion que va siempre)
                attributes: [],
            },
        }
    })
}

const getAllPokemons = async () => {        //funcion asincrona que espera info de api y db y devuelve el total.
    const apiInfo = await getApiInfo();     
    const dbInfo = await getDbInfo();
    const infoTotal = apiInfo.concat(dbInfo);
    return infoTotal;                       //pokemons de la api concatenados a los de la db
}

//RUTAS

// GET/pokemons y GET/pokemons?name="..."       //metodo HTTP GET
router.get('/pokemons', async(req, res) => {    //metodo .get() de express
    const name = req.query.name;                //el name viene por query
    let pokemonsTotal = await getAllPokemons(); //espero y me traigo todos los pokemons (api + db)

    if(name){                                   //si hay un query...(GET/pokemons?name=...)
        let pokemonName = pokemonsTotal.filter(el => el.name.toLowerCase().includes(name.toLowerCase())) //filtrame el pokemon cuyo name coincida con el name que me pasan por query.
        pokemonName.length ? res.status(200).send(pokemonName) : res.status(404).send('No está el Pokemon');    
    } else {                                    //si no hay un query... (GET/pokemons)
        res.status(200).send(pokemonsTotal)     //devuelvo todos los pokemons
    }
});

// GET/types
router.get('/types', async(req, res) => {
    const apiUrlTypes = await axios.get('https://pokeapi.co/api/v2/type') //accedo al endpoint de type que me da la Api
    const types = apiUrlTypes.data.results.map(el => el.name)             //me guardo el nombre de de c/tipo en el array types
    types.forEach(t => {                                  //recorro el array y por c/elm creo una entrada en la db Tipo
        Type.findOrCreate({         //.findOrCreate() si encuentra el tipo, lo muestra en la db y si no, lo crea en la db. Si uso .create() cada vez que haga una peticion me creará los 20 tipos.Metodos de sequelize
            where: {
                name: t,
            }
        })
    });

    const allTypes = await Type.findAll();  //guardo todo lo que haya en la db Tipo (nombre + id de c/tipo).
    res.status(200).send(allTypes);  //devuelvo solo la info de la db. Con esto me evito recorrer la api en cada peticion
})

// POST /pokemons
router.post('/pokemons', async(req, res) => {          //los datos vienen por body cuando el usuario llena el formulario de crear pokemon
    const { name, img, health, attack, defense, speed, height, weight, type, createdInDb } = req.body;
try{
    let pokemonCreated = await Pokemon.create({        //.create() crea una nueva instancia del modelo (un nuevo pokemon). Metodo Sequelize
        name,
        img, 
        health, 
        attack, 
        defense, 
        speed, 
        height, 
        weight,  
        createdInDb
    }) 

    let typeDb = await Type.findAll({   //dentro del modelo Tipo encontra todos los tipos...
        where: {                        //cuyo name coincida con el de type que recibo por body. Clausula where
            name: type,
        }
    })

    pokemonCreated.addType(typeDb);  //al pokemon creado le agrego el tipo que traje de la db (.add() metodo de sequelize Mixin)
    res.status(200).send('Pokémon creado con éxito!')
}catch(error){
    res.status(400).send('No se pudo crear el Pokémon')
}
})

// GET /pokemons/{idPokemon}

router.get('/pokemons/:id', async(req, res) => {
    const  { id } = req.params;                     //recibo el id por ruta dinamica. params
    const pokemonsTotal = await getAllPokemons();   //espero y me traigo todos los pokemons (api + db)

    if(id){
        let pokeId = pokemonsTotal.filter(p => p.id == id)
        pokeId.length? res.status(200).json(pokeId) : res.status(404).send('No se encontró el Pokémon') 
    }
})


module.exports = router;

//---------------------------------------------------------------------------------------------------------------------










//------------------------------------------------------------------------------------------------------------------

// // DELETE /delete-pokemons/:id
// router.delete('/delete-pokemons/:id', async (req, res) => {
//     let { id } = req.params
    
//     const pokeDb = await Pokemon.findAll();
//     let deletFilter = pokeDb.filter(el => el.id !== id)
//     deletFilter.length?  res.status(200).send(deletFilter) : res.status(400).send('error al borrar')

// });