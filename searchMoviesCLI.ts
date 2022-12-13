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
    while(programmeStillRunning){
        let actionSelection:string = readlineSync.question(`Welcome to search-movies-cli!\n[1] Search\n[2] See Favourites\n[3] Quit\nChoose an action! [1, 2, 3]: `);
        if(actionSelection==='1'){
            await searchForMovieInDB()
        } else if (actionSelection==='2'){
            await showFavourites()
        } else if(actionSelection==='3'){
            programmeStillRunning=false
        } else{
            actionSelection = readlineSync.question('Not a valid selection!\n[1] Search\n[2] See Favourites\n[3] Quit\nChoose an action! [1, 2, 3]: ')
        }
    }
}

async function showFavourites() {
    const client = new Client({database:'omdb'});
    await client.connect();
    const res = await client.query('SELECT * FROM favourites');
    console.log('Here are your saved favourites!');
    console.table(res.rows)
}

 
async function searchForMovieInDB(){
    let stillSearching = true
    while(stillSearching){
        const searchText = 
        `SELECT id, name, date_part('year', date) AS year, runtime, revenue, vote_average, votes_count 
        FROM movies
        WHERE UPPER(name) LIKE UPPER($1)
        AND kind = 'movie' 
        ORDER BY name 
        DESC LIMIT 10`;

        const favouriteText = 
        `INSERT INTO favourites (movie_id, name, year, runtime)
        VALUES ($1, $2, $3, $4)`

        let movieSearch = readlineSync.question('Search for a movie! ');
        const searchValue = [`%${movieSearch}%`]
        const client = new Client({ database: 'omdb' });
        await client.connect();
        const res = await client.query(searchText, searchValue);
        console.log(`Search term: ${movieSearch}`)
        console.table(res.rows);
        for(let i=0; i<res.rows.length; i++){
            console.log(`[${i+1}] ${res.rows[i].name}`)
        }
        console.log(`[0] CANCEL`)
        let responseString: number = Number(readlineSync.question('Choose a movie row number to favourite: '))
        let favSelection = res.rows[Number(responseString) -1]
        if(responseString > 0 && responseString < res.rows.length){
            console.log(`Saving favourite movie: ${favSelection.name}`)
            let faveValues = [favSelection.id, `${favSelection.name}`, favSelection.year, favSelection.runtime]
            await client.query(favouriteText, faveValues)
            await client.end();
        } else if (responseString === 0) {
            stillSearching = false
        }
    }
    

}


//searchForMovieInDB()
movieDBProgramme()