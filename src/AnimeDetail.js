// AnimeDetails.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './AnimeDetail.css';

const AnimeDetails = () => {
  const { animeLabel } = useParams();
  const [animeDetails, setAnimeDetails] = useState(null);
  
  const linkStyle = {
    textDecoration: 'none', 
    color: 'inherit' 
  }
  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await axios.get('https://query.wikidata.org/sparql', {
          params: {
            query: `
              SELECT ?anime ?animeLabel ?logo ?description ?author ?authorLabel ?composer ?composerLabel ?productionCompany ?productionCompanyLabel ?numberOfSeasons ?numberOfEpisodes ?startTime
              WHERE {
                ?anime wdt:P31 wd:Q63952888;
                       rdfs:label ?animeLabel.

                OPTIONAL {
                  ?anime wdt:P154 ?logo.
                }

                OPTIONAL {
                  ?anime schema:description ?description.
                  FILTER(LANG(?description) = "en")
                }

                OPTIONAL {
                  ?anime wdt:P50 ?author.           # Author
                  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
                }

                OPTIONAL {
                  ?anime wdt:P86 ?composer.         # Composer
                  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
                }

                OPTIONAL {
                  ?anime wdt:P272 ?productionCompany. # Production Company
                  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
                }

                OPTIONAL {
                  ?anime wdt:P2437 ?numberOfSeasons. # Number of Seasons
                }

                OPTIONAL {
                  ?anime wdt:P1113 ?numberOfEpisodes. # Number of Episodes
                }

                OPTIONAL {
                  ?anime wdt:P580 ?startTime. # Start time
                }

                FILTER(LANG(?animeLabel) = "en" && CONTAINS(?animeLabel, "${animeLabel}"))
              }
            `,
            format: 'json',
          },
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Anime-Details/1.0',
            Accept: 'application/json',
          },
        });

        setAnimeDetails(response.data.results.bindings[0]);
      } catch (error) {
        console.error('Erreur lors de la requête SPARQL', error);
      }
    };

    fetchAnimeDetails();
  }, [animeLabel]);

  if (!animeDetails) {
    return <p>Loading anime details...</p>;
  }

  return (
    <div>
      <div class="navbar">
      <Link to="/" style={linkStyle}>
        <text>Anime Data</text>
      </Link>
      </div>
      
      <table id = 'PanelDetail'>
        <tbody>
        <tr>
            <td class = "infoTable" id="label">Title</td>
            <td class = "infoTable" colspan="6">{animeDetails.animeLabel && <p className="animeTitle">{decodeURIComponent(animeDetails.animeLabel.value)}</p>}</td>
          </tr>
          <tr>
            <td class = "infoTable" id="label">Logo</td>
            <td class = "infoTable" colspan="6">{animeDetails.logo && <img src={animeDetails.logo.value} alt="Logo de l'anime" className="anime-logo" />}</td>
          </tr>
          <tr>
            <td class = "infoTable" id="label">Description</td>
            <td  class = "infoTable" colspan="2">{animeDetails.description && <p className="description">{decodeURIComponent(animeDetails.description.value)}</p>}</td>
            <td  class = "infoTable" id="label">Release Date</td>
            <td  class = "infoTable" colspan="2">{animeDetails.startTime && <p>{decodeURIComponent(animeDetails.startTime.value)}</p>}</td>
          </tr>
          <tr>
            <td class = "infoTable" id="label">Author</td>
            <td class = "infoTable" colspan="2">{animeDetails.authorLabel && <p>{decodeURIComponent(animeDetails.authorLabel.value)}</p>}</td>
            <td class = "infoTable" id="label">Composer</td>
            <td class = "infoTable" colspan="2">{animeDetails.composerLabel && <p>{decodeURIComponent(animeDetails.composerLabel.value)}</p>}</td>
          </tr>

          <tr>
            <td class = "infoTable" id="label">Number of seasons</td>
            <td class = "infoTable">{animeDetails.numberOfSeasons && <p>{decodeURIComponent(animeDetails.numberOfSeasons.value)}</p>}</td>
            <td class = "infoTable" id="label">Number of episodes</td>
            <td class = "infoTable">{animeDetails.numberOfEpisodes && <p>{decodeURIComponent(animeDetails.numberOfEpisodes.value)}</p>}</td>
            <td class = "infoTable" id="label">Production Company</td>
            <td class = "infoTable">{animeDetails.productionCompanyLabel && <p>{decodeURIComponent(animeDetails.productionCompanyLabel.value)}</p>}</td>          
          </tr>
        </tbody>
      </table>
      <br></br>
      <br></br>
    </div>
    
  );
};

export default AnimeDetails;
