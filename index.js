
const express = require( 'express' );
const connectDB = require( './DBconfig/connect' );
const config = require( "config" );
const app = express();

connectDB();

if ( !config.get( "jwtSecret" ) )
{
  console.error( "FATAL ERROR: jwtSecret is not defined." );
  process.exit( 1 );
}

app.use( express.json() );


const PORT = process.env.PORT || 3000;

app.listen( PORT, () => {
  console.log( `Server running on port ${ PORT }` );
} );
