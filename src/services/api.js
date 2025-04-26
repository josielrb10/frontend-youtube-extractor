import axios from 'axios';

// Configuração da API
const API_URL = process.env.REACT_APP_API_URL || 'https://site-extracao-backend.onrender.com/api';

// Instância do axios com configuração base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Funções para interagir com a API do backend

// YouTube
export const analisarCanalYoutube = async (url, options = {}) => {
  try {
    const response = await api.post('/youtube/analisar', {
      url,
      ordenarPor: options.order,
      quantidade: options.maxResults
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao analisar canal do YouTube:', error);
    return {
      sucesso: false,
      mensagem: error.response?.data?.mensagem || 'Erro ao analisar canal do YouTube.'
    };
  }
};

// Exportar a instância do axios para uso em outros componentes
export default api;
