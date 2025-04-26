import React from 'react';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import AnaliseYoutube from './components/AnaliseYoutube';

function App() {
  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Extrator de Dados do YouTube
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <AnaliseYoutube />
        </Box>
      </Container>
    </>
  );
}

export default App;
