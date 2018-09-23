import MetaClient from '/js/metaclient/metaclient.esm.js'

console.log(MetaClient);
MetaClient.getInstance()
    .then(instance => console.log(instance), err => console.log(err));

