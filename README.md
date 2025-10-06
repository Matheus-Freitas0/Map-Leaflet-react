# 🗺️ Map Leaflet React

Uma aplicação web interativa para visualização de imóveis em São Paulo usando React, Leaflet e Material-UI.

![Map Leaflet React](https://img.shields.io/badge/React-18-blue) ![Leaflet](https://img.shields.io/badge/Leaflet-1.7-green) ![Material--UI](https://img.shields.io/badge/Material--UI-5-blue) ![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-Free-orange)

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Componentes](#-componentes)
- [Dados Mock](#-dados-mock)
- [Personalização](#-personalização)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## ✨ Funcionalidades

### 🗺️ **Mapa Interativo**

- **Visualização em tempo real** com OpenStreetMap
- **Clusters inteligentes** que se expandem conforme o zoom
- **Marcadores personalizados** com ícones azuis e números brancos
- **Zoom automático** ao selecionar imóveis da lista
- **Popups informativos** com detalhes completos dos imóveis

### 📋 **Lista de Imóveis**

- **Cards responsivos** com informações detalhadas
- **Filtros por tipo** (Casa, Apartamento, Sobrado, Kitnet)
- **Filtros por preço** (faixas personalizáveis)
- **Botões de ação**:
  - 🔍 **Localizar**: Zoom no mapa + abre popup
  - 👁️ **Ver Detalhes**: Abre informações detalhadas

### 🎯 **Interação Bidirecional**

- **Lista → Mapa**: Clique seleciona e localiza no mapa
- **Mapa → Lista**: Clique no marcador seleciona na lista
- **Sincronização automática** entre componentes
- **Seleção visual** com bordas azuis e sombras

### 🎨 **Interface Moderna**

- **Material-UI** para componentes consistentes
- **Design responsivo** para desktop e mobile
- **Cores temáticas** azul e verde para ações
- **Animações suaves** e transições elegantes

## 🛠️ Tecnologias

### **Frontend**

- **React 18** - Biblioteca de interface
- **Material-UI 5** - Componentes de UI
- **Leaflet 1.7** - Biblioteca de mapas
- **React-Leaflet** - Integração React + Leaflet
- **Leaflet.markercluster** - Agrupamento de marcadores

### **Mapas**

- **OpenStreetMap** - Dados geográficos gratuitos
- **CartoDB Light** - Estilo de mapa claro e moderno

### **Desenvolvimento**

- **Vite** - Build tool e dev server
- **ESLint** - Linting de código
- **Prettier** - Formatação de código

## 🚀 Instalação

### **Pré-requisitos**

- Node.js 16+
- npm ou yarn

### **Clone e Instale**

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/map-leaflet-react.git

# Entre no diretório
cd map-leaflet-react

# Instale as dependências
npm install
```

### **Dependências Principais**

```bash
npm install react react-dom
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install leaflet react-leaflet leaflet.markercluster
```

## 🎮 Uso

### **Desenvolvimento**

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Acesse http://localhost:5173
```

### **Build para Produção**

```bash
# Gere o build otimizado
npm run build

# Visualize o build
npm run preview
```

### **Como Usar a Aplicação**

1. **🔍 Filtros**: Use os dropdowns no topo para filtrar por tipo e preço
2. **📋 Lista**: Navegue pelos imóveis na lista à esquerda
3. **🗺️ Mapa**: Visualize os imóveis no mapa à direita
4. **🎯 Interação**:
   - Clique em um imóvel na lista → zoom no mapa + popup
   - Clique em um marcador no mapa → seleciona na lista
   - Use os botões "Localizar" e "Ver Detalhes" para ações específicas

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── PropertyMap.jsx      # Componente principal do mapa
│   ├── PropertyList.jsx    # Lista de imóveis com cards
│   └── PropertyFilters.jsx # Filtros de tipo e preço
├── data/
│   └── mockProperties.js   # Dados mock dos imóveis
├── App.jsx                 # Componente principal
├── App.css                 # Estilos globais
└── main.jsx               # Ponto de entrada
```

## 🧩 Componentes

### **PropertyMap**

- **Responsabilidade**: Renderização do mapa Leaflet
- **Funcionalidades**:
  - Clusters de marcadores
  - Popups informativos
  - Zoom automático
  - Eventos de movimento

### **PropertyList**

- **Responsabilidade**: Lista de imóveis com cards
- **Funcionalidades**:
  - Cards responsivos
  - Botões de ação
  - Seleção visual
  - Scroll infinito

### **PropertyFilters**

- **Responsabilidade**: Filtros de busca
- **Funcionalidades**:
  - Filtro por tipo de imóvel
  - Filtro por faixa de preço
  - Interface Material-UI

## 📊 Dados Mock

### **Estrutura do Imóvel**

```javascript
{
  id: 1,
  title: "Casa térrea com 3 dormitórios no centro da cidade",
  price: 1200,
  area: 80,
  bedrooms: 3,
  bathrooms: 2,
  parkingSpaces: 1,
  type: "casa",
  description: "Descrição detalhada...",
  images: ["https://exemplo.com/imagem.jpg"],
  location: {
    lat: -23.5505,
    lng: -46.6333,
    address: "Centro, São Paulo - SP",
    neighborhood: "Centro"
  }
}
```

### **Tipos de Imóveis**

- 🏠 **Casa** - Residências térreas
- 🏢 **Apartamento** - Unidades em edifícios
- 🏘️ **Sobrado** - Casas de dois andares
- 🏠 **Kitnet** - Estúdios compactos

### **Faixas de Preço**

- 💰 **Até R$ 1.000** - Imóveis econômicos
- 💰 **R$ 1.000 - R$ 2.000** - Faixa média
- 💰 **R$ 2.000 - R$ 3.000** - Faixa alta
- 💰 **R$ 3.000 - R$ 5.000** - Faixa premium
- 💰 **Acima de R$ 5.000** - Faixa luxo

## 🎨 Personalização

### **Cores dos Clusters**

```css
.marker-cluster-small,
.marker-cluster-medium,
.marker-cluster-large {
  background-color: #007bff !important;
  border: 2px solid white !important;
}
```

### **Estilo do Mapa**

```javascript
// CartoDB Light - estilo claro e moderno
url = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
```

### **Configurações do Cluster**

```javascript
const clusterGroup = L.markerClusterGroup({
  maxClusterRadius: 60,
  disableClusteringAtZoom: 17,
  spiderfyOnMaxZoom: true,
});
```

## 🤝 Contribuição

### **Como Contribuir**

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### **Padrões de Código**

- **ESLint** para linting
- **Prettier** para formatação
- **Conventional Commits** para mensagens
- **Componentes funcionais** com hooks

### **Roadmap**

- [ ] 🔐 Autenticação de usuários
- [ ] 💾 Persistência de dados (Firebase/Supabase)
- [ ] 📱 PWA (Progressive Web App)
- [ ] 🌍 Suporte a múltiplas cidades
- [ ] 📊 Dashboard de estatísticas
- [ ] 🔔 Notificações em tempo real

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Seu Nome**

- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- LinkedIn: [Seu LinkedIn](https://linkedin.com/in/seu-perfil)
- Email: seu.email@exemplo.com

## 🙏 Agradecimentos

- **OpenStreetMap** - Dados geográficos gratuitos
- **Leaflet** - Biblioteca de mapas open-source
- **Material-UI** - Componentes React elegantes
- **React** - Biblioteca de interface moderna

---

⭐ **Se este projeto te ajudou, considere dar uma estrela!**

📧 **Dúvidas? Entre em contato através das issues do GitHub.**
