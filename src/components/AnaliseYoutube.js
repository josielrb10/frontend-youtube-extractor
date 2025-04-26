import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  TextField, 
  Button, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SortIcon from '@mui/icons-material/Sort';
import { analisarCanalYoutube } from '../services/api';

const AnaliseYoutube = () => {
  const [url, setUrl] = useState('');
  const [canalInfo, setCanalInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [videoSelecionado, setVideoSelecionado] = useState(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [ordenacao, setOrdenacao] = useState('viewCount');
  const [maxResults, setMaxResults] = useState(20);
  const [analisando, setAnalisando] = useState(false);
  const [mensagem, setMensagem] = useState({ aberta: false, tipo: 'info', texto: '' });

  // Exibir mensagem
  const exibirMensagem = (tipo, texto) => {
    setMensagem({ aberta: true, tipo, texto });
  };

  // Fechar mensagem
  const fecharMensagem = () => {
    setMensagem({ ...mensagem, aberta: false });
  };

  // Analisar canal do YouTube
  const analisarCanal = async () => {
    if (!url) {
      exibirMensagem('error', 'Por favor, insira a URL do canal do YouTube.');
      return;
    }

    if (!url.includes('youtube.com/')) {
      exibirMensagem('error', 'URL inválida. Forneça uma URL válida de canal do YouTube.');
      return;
    }

    try {
      setAnalisando(true);
      
      const response = await analisarCanalYoutube(url, {
        maxResults,
        order: ordenacao
      });
      
      if (response.sucesso) {
        setCanalInfo(response.canal);
        setVideos(response.videos);
        exibirMensagem('success', 'Canal analisado com sucesso!');
      } else {
        exibirMensagem('error', response.mensagem || 'Erro ao analisar canal.');
      }
    } catch (error) {
      console.error('Erro ao analisar canal:', error);
      exibirMensagem('error', 'Erro ao analisar canal. Por favor, tente novamente.');
    } finally {
      setAnalisando(false);
    }
  };

  // Abrir dialog de detalhes do vídeo
  const abrirDetalhes = (video) => {
    setVideoSelecionado(video);
    setDialogAberto(true);
  };

  // Fechar dialog de detalhes
  const fecharDetalhes = () => {
    setDialogAberto(false);
    setVideoSelecionado(null);
  };

  // Formatar número
  const formatarNumero = (numero) => {
    return new Intl.NumberFormat('pt-BR').format(numero);
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Análise de Canal YouTube
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Analise canais do YouTube para encontrar os vídeos mais populares.
      </Typography>

      {/* Formulário de análise */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="URL do Canal do YouTube"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Ex: https://www.youtube.com/channel/..."
                helperText="Insira a URL completa do canal do YouTube"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="ordenacao-label">Ordenar por</InputLabel>
                <Select
                  labelId="ordenacao-label"
                  value={ordenacao}
                  label="Ordenar por"
                  onChange={(e) => setOrdenacao(e.target.value)}
                >
                  <MenuItem value="viewCount">Visualizações</MenuItem>
                  <MenuItem value="date">Data (mais recentes)</MenuItem>
                  <MenuItem value="rating">Avaliação</MenuItem>
                  <MenuItem value="relevance">Relevância</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="max-results-label">Quantidade</InputLabel>
                <Select
                  labelId="max-results-label"
                  value={maxResults}
                  label="Quantidade"
                  onChange={(e) => setMaxResults(e.target.value)}
                >
                  <MenuItem value={10}>10 vídeos</MenuItem>
                  <MenuItem value={20}>20 vídeos</MenuItem>
                  <MenuItem value={30}>30 vídeos</MenuItem>
                  <MenuItem value={50}>50 vídeos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={analisarCanal}
                startIcon={<YouTubeIcon />}
                disabled={analisando}
              >
                {analisando ? <CircularProgress size={24} /> : 'Analisar Canal'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Informações do canal */}
      {canalInfo && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src={canalInfo.thumbnail} 
                    alt={canalInfo.nome} 
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      borderRadius: '50%',
                      border: '2px solid #f0f0f0'
                    }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={9}>
                <Typography variant="h5" gutterBottom>
                  {canalInfo.nome}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {canalInfo.descricao}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="h6">
                        {formatarNumero(canalInfo.inscritos)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Inscritos
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="h6">
                        {formatarNumero(canalInfo.totalVideos)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Vídeos
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="h6">
                        {formatarNumero(canalInfo.totalViews)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Visualizações
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Lista de vídeos */}
      {videos.length > 0 && (
        <>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">
              Vídeos do Canal
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SortIcon sx={{ mr: 1 }} />
              <Typography variant="body2" color="textSecondary">
                Ordenado por: {
                  ordenacao === 'viewCount' ? 'Visualizações' :
                  ordenacao === 'date' ? 'Data (mais recentes)' :
                  ordenacao === 'rating' ? 'Avaliação' : 'Relevância'
                }
              </Typography>
            </Box>
          </Box>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="tabela de vídeos">
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell align="right">Visualizações</TableCell>
                  <TableCell align="right">Likes</TableCell>
                  <TableCell align="right">Comentários</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {video.thumbnails && video.thumbnails.default && (
                          <img 
                            src={video.thumbnails.default.url} 
                            alt={video.titulo} 
                            style={{ width: '60px', marginRight: '10px' }} 
                          />
                        )}
                        <Typography variant="body2">
                          {video.titulo}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(video.metadados.data).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      {formatarNumero(video.metadados.visualizacoes)}
                    </TableCell>
                    <TableCell align="right">
                      {formatarNumero(video.metadados.likes)}
                    </TableCell>
                    <TableCell align="right">
                      {formatarNumero(video.metadados.comentarios)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="primary" 
                        onClick={() => abrirDetalhes(video)}
                        title="Ver detalhes"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Mensagem quando não há vídeos */}
      {canalInfo && videos.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Nenhum vídeo encontrado para este canal com os critérios selecionados.
          </Typography>
        </Paper>
      )}

      {/* Dialog de detalhes do vídeo */}
      <Dialog
        open={dialogAberto}
        onClose={fecharDetalhes}
        maxWidth="md"
        fullWidth
      >
        {videoSelecionado && (
          <>
            <DialogTitle>
              {videoSelecionado.titulo}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    {videoSelecionado.thumbnails && videoSelecionado.thumbnails.medium && (
                      <img 
                        src={videoSelecionado.thumbnails.medium.url} 
                        alt={videoSelecionado.titulo} 
                        style={{ maxWidth: '100%' }} 
                      />
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Link: <a href={videoSelecionado.link} target="_blank" rel="noopener noreferrer">{videoSelecionado.link}</a>
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Descrição do Vídeo
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'background.default', maxHeight: '200px', overflow: 'auto' }}>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                      {videoSelecionado.premissa}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Estatísticas
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">
                          {formatarNumero(videoSelecionado.metadados.visualizacoes)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Visualizações
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">
                          {formatarNumero(videoSelecionado.metadados.likes)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Likes
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">
                          {formatarNumero(videoSelecionado.metadados.comentarios)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Comentários
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">
                          {new Date(videoSelecionado.metadados.data).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Data de Publicação
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button 
                variant="contained" 
                color="primary" 
                href={videoSelecionado.link} 
                target="_blank"
              >
                Abrir no YouTube
              </Button>
              <Button onClick={fecharDetalhes}>Fechar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar para mensagens */}
      <Snackbar 
        open={mensagem.aberta} 
        autoHideDuration={6000} 
        onClose={fecharMensagem}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={fecharMensagem} severity={mensagem.tipo} sx={{ width: '100%' }}>
          {mensagem.texto}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AnaliseYoutube;
