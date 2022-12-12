import { question } from "readline-sync";
import { Client } from "pg";

//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.

console.log("Welcome to search-movies-cli!");

const readlineSync = require('readline-sync');
 
// Wait for user's response.


async function movieDBProgramme() {
    let programmeStillRunning = true;
    let actionSelection = readlineSync.question('Welcome to search-movies-cli!/n[1] Search/n[2] See Favourites/n[3] Quit/nChoose an action! [1, 2, 3]: ');

    while(programmeStillRunning){
        if(actionSelection===1){
            searchForMovieInDB()
        } else if (actionSelection===2){
            showFavourites()
        } else if(actionSelection===3){
            programmeStillRunning=false
        } else{
            actionSelection = readlineSync.question('Not a valid selection!/n[1] Search/n[2] See Favourites/n[3] Quit/nChoose an action! [1, 2, 3]: ')
        }
    }
}

async function showFavourites() {
    
}

 
async function searchForMovieInDB(){
    
    const text = 
    `SELECT name, date, runtime, revenue, vote_average, votes_count 
    FROM movies
    WHERE UPPER(name) LIKE UPPER($1)
    AND kind = 'movie' 
    ORDER BY name 
    DESC LIMIT 10`

    let movieSearch = readlineSync.question('Search for a movie! ');
    const value = [`%${movieSearch}%`]
    const client = new Client({ database: 'omdb' });
    await client.connect();
    const res = await client.query(text, value);
    console.table(res.rows);
    await client.end();
    }


searchForMovieInDB()