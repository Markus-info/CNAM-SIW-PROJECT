// App.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const App = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dataStatic, setDataStatic] = useState([]);
  const linkStyle = {
    textDecoration: 'none', 
    color: 'inherit' 
  }
  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    // N'exécute la requête que si le terme de recherche n'est pas vide
    if (searchTerm.trim() !== '') {
      const fetchData = async () => {
        try {
          const response = await axios.get('https://query.wikidata.org/sparql', {
            params: {
              query: `
                SELECT ?anime ?animeLabel
                WHERE {
                  ?anime wdt:P31 wd:Q63952888;
                         rdfs:label ?animeLabel.
                  FILTER(LANG(?animeLabel) = "en" && CONTAINS(?animeLabel, "${searchTerm}"))
                }
              `,
              format: 'json',
            },
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'Anime-Accueil/1.0',
              Accept: 'application/json',
            },
          });
          setData(response.data.results.bindings);
        } catch (error) {
          console.error('Erreur lors de la requête SPARQL', error);
        }
      };

      fetchData();
    } else {
      // Efface les résultats si le terme de recherche est vide
      const fetchTopAnime = async () => {
        try {
          const response = await axios.get('https://query.wikidata.org/sparql', {
            params: {
              query: `
                SELECT ?anime ?animeLabel ?socialMediaFollowers
                WHERE {
                  ?anime wdt:P31 wd:Q63952888;
                         rdfs:label ?animeLabel.
                  FILTER(LANG(?animeLabel) = "en" )

                  OPTIONAL {
                    ?anime wdt:P8687 ?socialMediaFollowers. # Social Media Followers
                  }
                }
                ORDER BY DESC(?socialMediaFollowers)
                LIMIT 10
              `,
              format: 'json',
            },
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'Anime-Accueil/1.0',
              Accept: 'application/json',
            },
          });
          setDataStatic(response.data.results.bindings);
        } catch (error) {
          console.error('Erreur lors de la requête SPARQL', error);
        }
      };

      fetchTopAnime();
    }
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset Page 1
  };

  //Pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const visiblePages = () => {
    const totalVisiblePages = 5;
    const halfVisiblePages = Math.floor(totalVisiblePages / 2);
  
    if (totalPages <= totalVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
  
    if (currentPage <= halfVisiblePages + 1) {
      return Array.from({ length: totalVisiblePages }, (_, i) => i + 1);
    }
  
    if (currentPage >= totalPages - halfVisiblePages) {
      return Array.from({ length: totalVisiblePages }, (_, i) => totalPages - totalVisiblePages + i + 1);
    }
  
    return Array.from({ length: totalVisiblePages }, (_, i) => currentPage - halfVisiblePages + i);
  };


  return (
    <div>
      <div class="navbar">
      <Link to="/" style={linkStyle}>
        <text>Anime Data</text>
      </Link>
        <div class="search-bar">
          <input
              type="text"
              placeholder="Rechercher un anime..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
    </div>
      
     
      
      <div style={{ display: 'flex' }}>
        <div id='result'>
        {searchTerm.trim() !== '' && <text>  &nbsp;Result :</text>}
          <ul>
            {displayedData.map((item, index) => (
              <li key={index}>
                <Link to={`/anime/${encodeURIComponent(item.animeLabel.value)}`} style={linkStyle}>
                  {item.animeLabel.value}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {dataStatic.length > 0 && (
          <table style={{ marginLeft: '20px' }}>
            <caption>TOP 10 Animes (Sorted by followers)</caption>
            <thead>
              <tr>
                <th class = "infoTable">Title</th>
                <th class = "infoTable">Followers</th>
              </tr>
            </thead>
            <tbody>
              {dataStatic.map((item, index) => (
                <tr key={index}>
                  <td class = "infoTable"><Link to={`/anime/${encodeURIComponent(item.animeLabel.value)}`} style={linkStyle}>
                {item.animeLabel.value}
              </Link></td>
                  <td class = "infoTable">{item.socialMediaFollowers.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
      </div>
      <table id="pagination">
        <tbody>
          <tr>
            <td>
              <button onClick={() => handlePageChange(1)}>
                First
              </button>
            </td>
            <td>
              <button
                onClick={() => handlePageChange(
                  currentPage > 1 ? currentPage - 1 : currentPage
                )}
              >
                Prev
              </button>
            </td>
            {visiblePages().map((page) => (
              <td
                key={page}
                onClick={() => handlePageChange(page)}
                className={page === currentPage ? 'current-page' : ''}
              >
                {page}
              </td>
            ))}
            <td>
              <button
                onClick={() => handlePageChange(
                  currentPage < totalPages ? currentPage + 1 : currentPage
                )}
              >
                Next
              </button>
            </td>
            <td>
              <button onClick={() => handlePageChange(totalPages)}>
                Last
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default App;
