import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
} from "react-bootstrap";
import { useState, useEffect } from "react";

const CLIENT_ID = "939c6e54d65740ce91e193c2aceab936";
const CLIENT_SECRET = "2d7be9e3a3dd4691899ce3c56390d5c6";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    // API access token
    var authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  // search function
  async function search() {
    console.log("Search for " + searchInput);

    // Get request using search to get the ArtistID
    var searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    var ArtistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        return data.artists.items[0].id;
      });

    console.log("Artist ID is " + ArtistID);

    // Get request with Artist ID to grab all the albums from that artist
    var returnedAlbums = await fetch(
      "https://api.spotify.com/v1/artists/" +
        ArtistID +
        "/albums" +
        "?include_groups=album&market=US&limit=50",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAlbums(data.items);
      });
    // Display those albums to the user
  }
  console.log(albums);
  return (
    <div className="App">
      <Container className="content">
        <InputGroup className="input" size="lg">
          <FormControl
            placeholder=" Write the Artists Name & get the playlists"
            type="text"
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button
            variant="primary"
            onClick={() => console.log("Clicked Button")}
          >
            Search
          </Button>
        </InputGroup>
      </Container>

      <Container className="content1">
        <Row className="mx-2 row row-cols-4">
          {albums.map((albums, i) => {
            console.log(albums);
            return (
              <Card
                key={i}
                style={{
                  margin: '10px',
                  fontFamily: 'Arial',
                  fontSize: '16px',
                  color: 'white',
                  fontWeight: 'bold',
                  border: '2px solid black', // Add border
                  boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' // Add box shadow
                }}
              >
                <Card.Img src={albums.images[0].url} />
                <Card.Body>
                  <Card.Title>{albums.name}</Card.Title>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}

export default App;
