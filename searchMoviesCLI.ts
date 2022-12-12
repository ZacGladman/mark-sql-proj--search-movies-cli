import { question } from "readline-sync";
import { Client } from "pg";

//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.

console.log("Welcome to search-movies-cli!");

const readlineSync = require('readline-sync');
 
// Wait for user's response.




 
async function searchForMovieInDB(){
    
    let programmeStillRunning = true

    const text = 
    `SELECT name, date, runtime, revenue, vote_average, votes_count 
    FROM movies
    WHERE UPPER(name) LIKE UPPER($1)
    AND kind = 'movie' 
    ORDER BY name 
    DESC LIMIT 10`

    while (programmeStillRunning === true) {
        let movieSearch = readlineSync.question('Search for a movie or press "q" to quit! ');
        if(movieSearch === 'q'){
            programmeStillRunning = false
        } else{
            const value = [`%${movieSearch}%`]
            const client = new Client({ database: 'omdb' });
            await client.connect();
            const res = await client.query(text, value);
            console.table(res.rows);
            await client.end();
        }
        
    }
}

searchForMovieInDB()