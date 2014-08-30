var server = require('./server');
var dataSource = server.dataSources.accountDB;

dataSource.discoverSchema('account', { owner: 'dbo' }, function(er, schema) {
  if (er) throw er;
  console.log(JSON.stringify(schema, null, '  '));
});

dataSource.discoverAndBuildModels('account', { owner: 'dbo' },
    function(er, models) {
  if (er) throw er;
  models.Account.find(function(er, accounts) {
    if (er) return console.log(er);
    console.log(accounts);
    dataSource.disconnect();
  });
});
