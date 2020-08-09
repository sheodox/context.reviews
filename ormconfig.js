require('dotenv').config();

module.exports = {
   type: 'postgres',
   host: process.env.PGHOST,
   username: process.env.PGUSER,
   password: process.env.PGPASSWORD,
   database: process.env.PGDATABASE,
   synchronize: false,
   logging: process.env.NODE_ENV === 'development' ?
       ['query', 'error'] : ['error'],
   entities: [
      'src/entity/**/*.js'
   ],
   migrations: [
      'src/migration/**/*.js'
   ],
   subscribers: [
      'src/subscriber/**/*.js'
   ],
   cli: {
      entitiesDir: 'src/entity',
      migrationsDir: 'src/migration',
   }
}