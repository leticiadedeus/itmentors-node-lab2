const os = require('os');
const axios = require('axios');

var user = os.userInfo();

const product = require('../service/product')

const yargs = require('yargs')
let br = '----';

console.log(`Minha aplicação de produtos - por ${user.username}, idade ${product.age}`);

const importProducts = () => {

    axios.get('https://fakestoreapi.com/products')
        .then(response => {

            let list = []

            response.data.map(it => {

                list.push(product.SetProduct(
                    it.title,
                    it.description,
                    it.price,
                    it.stock || 1000,
                    it.image || 'https://loremflickr.com/200/200'
                ))
            })

            product.AddList(list, () => {
                console.log(`list imported`);
            });
        })
        .catch(error => {
            console.log(error);
        });

}

const addProduct = argv => {

    product.AddProduct(product.SetProduct(
        argv.title,
        argv.description,
        argv.price,
        argv.stock || 1000,
        argv.image || 'https://loremflickr.com/200/200'
    ), () => {
        console.log(`product ${argv.title} created`);
    });
}

const listAll = () => {

    var productsList = product.ListAll();

    for (let index = 0; index < 5; index++) {
        br += br
    }

    console.log(br);

    productsList.forEach(prod => {
        console.log(prod.id);
        console.log(prod.name);
        console.log(prod.price);

        console.log(prod.stock);

        if(prod.image)
            console.log(prod.image);

        console.log(br);
    });
}

let commands = yargs
    .usage('Usage: $0 <command> [options]')
    .command({
        command: 'create',
        describe: 'Creates a new product',
        builder: {
            title: {
                describe: "product name",
                alias: 't',
                demandOption: true,
                type: 'string'
            },
            description: {
                describe: "product description",
                alias: 'd',
                demandOption: true,
                type: 'string'
            },
            price: {
                describe: "product price",
                alias: 'p',
                demandOption: true,
                type: 'number'
            },
            stock: {
                describe: "product stock",
                alias: 's',
                demandOption: true,
                type: 'number'
            }
        },
        handler: addProduct
    })
    .command({
        command: 'list',
        describe: 'List all products',
        handler: listAll
    })
    .command({
        command: 'import',
        describe: 'Import extern products',
        handler: importProducts
    })
    .help('h')
    .epilog('copyright 2021')
    .alias('h', 'help').argv


switch (process.argv[2]) {
    case 'read':
        
        var productsList = product.GetProduct(commands.id);

        for (let index = 0; index < 5; index++) {
            br += br
        }

        console.log(br);

        productsList.forEach(prod => {
            console.log(prod.id);
            console.log(prod.name);
            console.log(prod.price);
            console.log(prod.stock);
            console.log(br);
        });

        break;
    case 'update':
    case 'delete':
    default:
        break;
}

//console.log(process.argv);
//console.log(yargs.argv);