import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function RickComponent() {
  const [data, setData] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  const fetchData = () => {
    fetch("https://rickandmortyapi.com/api/character/?page=2")
      .then((response) => response.json())
      .then((result) => {
        setData(result.results);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Typography variant="h3" gutterBottom style={{ color: 'white' }}>
  Api Rick And Morty
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Ocultar Detalles" : "Obtener Api de R&M"}
      </Button>
      <Box mt={4} display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2}>
        {data.map((item) => (
          <Card key={item.id}>
              <CardMedia
              component="img"
              height="140"
              image={item.image}
              alt={item.name}
            />
            {showDetails && (
              <CardContent>
                <Typography variant="h5" component="h2">
                  {item.name}
                </Typography>
                <Typography color="textSecondary" fontFamily="Comic Sans MS">
                  Status: {item.status}
                </Typography>
                <Typography color="textSecondary" fontFamily="Comic Sans MS">
                  Species: {item.species}
                </Typography>
                <Typography color="textSecondary" fontFamily="Comic Sans MS">
                  Type: {item.type}
                </Typography>
                <Typography color="textSecondary"fontFamily="Comic Sans MS">
                  Gender: {item.gender}
                </Typography>
              </CardContent>
            )}
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default RickComponent;

