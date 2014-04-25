var app = require('./app');
var dataSource = app.dataSources.accountDB;

dataSource.discoverSchema('account', {owner: 'dbo'}, function (err, schema) {
    console.log(JSON.stringify(schema, null, '  '));
});

dataSource.discoverAndBuildModels('account', {owner: 'dbo'}, function (err, models) {
    models.Account.find(function (err, act) {
        if (err) {
            console.error(err);
        } else {
            console.log('Accounts', act);
        }
        dataSource.disconnect();
    });
});

