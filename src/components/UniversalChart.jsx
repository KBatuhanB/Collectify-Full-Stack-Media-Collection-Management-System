import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from 'chart.js';
import { Pie, Bar, Line, Doughnut } from 'react-chartjs-2';
import { Paper, Typography, Box } from '@mui/material';
import { CHART_MESSAGES } from '../config/constants';

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, 
  LinearScale, BarElement, LineElement, PointElement
);

/**
 * Evrensel chart bileşeni - farklı chart tiplerini destekler
 * @param {Array} data - Chart için veri dizisi
 * @param {string} title - Chart başlığı
 * @param {string} type - Chart tipi ('pie', 'bar', 'line', 'doughnut')
 * @param {string} dataKey - Gruplamak için kullanılacak veri anahtarı
 * @param {Function} labelTransform - Label dönüştürme fonksiyonu
 * @param {Array} colors - Chart renkleri
 * @param {Object} chartOptions - Ek chart seçenekleri
 * @param {number} height - Chart yüksekliği
 */
function UniversalChart({ 
  data = [], 
  title, 
  type = 'pie', 
  dataKey, 
  labelTransform = (label) => label,
  colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
  ],
  chartOptions = {},
  height = 300
}) {

  // Veriyi grupla ve say
  const groupData = () => {
    if (!dataKey) return {};
    
    return data.reduce((acc, item) => {
      const key = item[dataKey] || 'Belirtilmemiş';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  };

  const groupedData = groupData();
  const labels = Object.keys(groupedData).map(labelTransform);
  const values = Object.values(groupedData);

  // Chart data objesi
  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: type === 'line' ? colors[0] : colors.slice(0, labels.length),
        borderWidth: type === 'line' ? 2 : 1,
        fill: type === 'line' ? false : true,
      },
    ],
  };

  // Default chart seçenekleri
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: type === 'bar' || type === 'line' ? 'top' : 'bottom',
        display: true,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.parsed.y || context.parsed;
            const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
            
            if (type === 'pie' || type === 'doughnut') {
              return `${context.label}: ${value} (${percentage}%)`;
            }
            return `${context.label}: ${value}`;
          }
        }
      }
    },
    scales: (type === 'bar' || type === 'line') ? {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    } : undefined,
  };

  // Seçenekleri birleştir
  const finalOptions = { ...defaultOptions, ...chartOptions };

  // Chart tipine göre component seç
  const getChartComponent = () => {
    switch (type) {
      case 'bar':
        return <Bar data={chartData} options={finalOptions} />;
      case 'line':
        return <Line data={chartData} options={finalOptions} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={finalOptions} />;
      case 'pie':
      default:
        return <Pie data={chartData} options={finalOptions} />;
    }
  };

  // Veri yoksa boş durum göster
  if (data.length === 0) {
    return (
      <Paper sx={{ p: 2, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {CHART_MESSAGES.NO_DATA}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, height }}>
      {title && (
        <Typography variant="h6" gutterBottom align="center" sx={{ mb: 2 }}>
          {title}
        </Typography>
      )}
      <Box sx={{ height: height - (title ? 80 : 40) }}>
        {getChartComponent()}
      </Box>
    </Paper>
  );
}

export default UniversalChart;
