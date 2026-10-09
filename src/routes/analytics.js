const router = require('express').Router();
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const analyticsClient = new BetaAnalyticsDataClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const PROPERTY = `properties/554942139`; // Reemplazar con tu property ID numérico

router.get('/', async (req, res) => {
  try {
    // Usuarios activos hoy, 7 días, 30 días
    const [activeUsers] = await analyticsClient.runReport({
      property: PROPERTY,
      dateRanges: [
        { startDate: 'today', endDate: 'today' },
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'newUsers' },
        { name: 'averageSessionDuration' },
      ],
    });

    const [activeUsers7] = await analyticsClient.runReport({
      property: PROPERTY,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }],
    });

    const [activeUsers30] = await analyticsClient.runReport({
      property: PROPERTY,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }],
    });

    // Top países
    const [countries] = await analyticsClient.runReport({
      property: PROPERTY,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      limit: 10,
    });

    // Páginas más vistas
    const [pages] = await analyticsClient.runReport({
      property: PROPERTY,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 5,
    });

    // Usuarios por día (últimos 30 días)
    const [daily] = await analyticsClient.runReport({
      property: PROPERTY,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    });

    const getValue = (report, row = 0, col = 0) =>
      report?.rows?.[row]?.metricValues?.[col]?.value || '0';

    res.json({
      hoy: parseInt(getValue(activeUsers)),
      siete: parseInt(getValue(activeUsers7)),
      treinta: parseInt(getValue(activeUsers30)),
      sesiones: parseInt(getValue(activeUsers, 0, 1)),
      nuevos: parseInt(getValue(activeUsers, 0, 2)),
      duracion: parseFloat(getValue(activeUsers, 0, 3)),
      paises: countries?.rows?.map(r => ({
        pais: r.dimensionValues[0].value,
        usuarios: parseInt(r.metricValues[0].value),
      })) || [],
      paginas: pages?.rows?.map(r => ({
        ruta: r.dimensionValues[0].value,
        vistas: parseInt(r.metricValues[0].value),
      })) || [],
      diario: daily?.rows?.map(r => ({
        fecha: r.dimensionValues[0].value,
        usuarios: parseInt(r.metricValues[0].value),
      })) || [],
    });
  } catch (e) {
    console.error('Analytics error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
