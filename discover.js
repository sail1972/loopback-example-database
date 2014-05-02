var app = require('./app');
var dataSource = app.dataSources.accountDB;

dataSource.discoverSchema('account', {schema: 'public'}, function (err, schema) {
    console.log(JSON.stringify(schema, null, '  '));
});

dataSource.discoverAndBuildModels('account', {schema: 'public'}, function (err, models) {
    models.Account.find(function (err, act) {
        if (err) {
            console.error(err);
        } else {
            console.log(act);
        }
        dataSource.disconnect();
    });
});

