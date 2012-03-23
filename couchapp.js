var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = 
  { "_id":'_design/catmapper'
  , "description": "jQuery mobile app that collects specific locations from users"
  , "name": "Mobile Mapper"
  , "rewrites": 
    [ {from:"/", to:'index.html'}
    , {from:"/api", to:'/../../'}
    , {from:"/api/*", to:'/../../*'}
    , {from:"/*", to:'*'}
    ]
  };

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;