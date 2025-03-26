const { Pool } = require('pg');
const dbConfig = require('../config/dbConfig');
const pool = new Pool(dbConfig);
const logger = require('../utils/logger');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const statisticsController = {
  async getStats(req, res) {
    try {
      const totalTickets = await pool.query('SELECT COUNT(*) FROM tickets');
      const waitingTickets = await pool.query(
        'SELECT COUNT(*) FROM tickets WHERE status = $1',
        ['waiting']
      );
      const calledTickets = await pool.query(
        'SELECT COUNT(*) FROM tickets WHERE status = $1',
        ['called']
      );
      const completedTickets = await pool.query(
        'SELECT COUNT(*) FROM tickets WHERE status = $1',
        ['completed']
      );

      const operatorStats = await pool.query(`
        SELECT u.username, COUNT(t.id) as tickets_served, AVG(EXTRACT(EPOCH FROM (NOW() - t.created_at))) as avg_time
        FROM tickets t
        JOIN users u ON t.operator_id = u.id
        WHERE t.status = 'completed'
        GROUP BY u.id, u.username
      `);

      const stats = {
        total: parseInt(totalTickets.rows[0].count),
        waiting: parseInt(waitingTickets.rows[0].count),
        called: parseInt(calledTickets.rows[0].count),
        completed: parseInt(completedTickets.rows[0].count),
        operators: operatorStats.rows.map(row => ({
          username: row.username,
          ticketsServed: parseInt(row.tickets_served),
          avgTime: parseFloat(row.avg_time / 60).toFixed(2),
        })),
      };
      res.json(stats);
    } catch (error) {
      logger.error('Error fetching statistics:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  },

  async exportStatsPDF(req, res) {
    try {
      const stats = await getStatsData();
      const doc = new PDFDocument();
      const filePath = path.join(__dirname, '../../exports/stats.pdf');
      doc.pipe(fs.createWriteStream(filePath));

      doc.fontSize(20).text('Queue System Statistics', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(`Total Tickets: ${stats.total}`);
      doc.text(`Waiting: ${stats.waiting}`);
      doc.text(`Called: ${stats.called}`);
      doc.text(`Completed: ${stats.completed}`);
      doc.moveDown();
      doc.text('Operator Statistics:');
      stats.operators.forEach(op => {
        doc.text(`${op.username}: ${op.ticketsServed} tickets, Avg Time: ${op.avgTime} min`);
      });

      doc.end();
      res.download(filePath, 'stats.pdf', () => fs.unlinkSync(filePath));
    } catch (error) {
      logger.error('Error exporting PDF:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  },

  async exportStatsExcel(req, res) {
    try {
      const stats = await getStatsData();
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Statistics');

      worksheet.columns = [
        { header: 'Category', key: 'category', width: 20 },
        { header: 'Value', key: 'value', width: 15 },
      ];

      worksheet.addRow(['Total Tickets', stats.total]);
      worksheet.addRow(['Waiting', stats.waiting]);
      worksheet.addRow(['Called', stats.called]);
      worksheet.addRow(['Completed', stats.completed]);

      const operatorWorksheet = workbook.addWorksheet('Operators');
      operatorWorksheet.columns = [
        { header: 'Username', key: 'username', width: 20 },
        { header: 'Tickets Served', key: 'ticketsServed', width: 15 },
        { header: 'Avg Time (min)', key: 'avgTime', width: 15 },
      ];
      stats.operators.forEach(op => operatorWorksheet.addRow(op));

      const filePath = path.join(__dirname, '../../exports/stats.xlsx');
      await workbook.xlsx.writeFile(filePath);
      res.download(filePath, 'stats.xlsx', () => fs.unlinkSync(filePath));
    } catch (error) {
      logger.error('Error exporting Excel:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
};

async function getStatsData() {
  const totalTickets = await pool.query('SELECT COUNT(*) FROM tickets');
  const waitingTickets = await pool.query('SELECT COUNT(*) FROM tickets WHERE status = $1', ['waiting']);
  const calledTickets = await pool.query('SELECT COUNT(*) FROM tickets WHERE status = $1', ['called']);
  const completedTickets = await pool.query('SELECT COUNT(*) FROM tickets WHERE status = $1', ['completed']);
  const operatorStats = await pool.query(`
    SELECT u.username, COUNT(t.id) as tickets_served, AVG(EXTRACT(EPOCH FROM (NOW() - t.created_at))) as avg_time
    FROM tickets t
    JOIN users u ON t.operator_id = u.id
    WHERE t.status = 'completed'
    GROUP BY u.id, u.username
  `);

  return {
    total: parseInt(totalTickets.rows[0].count),
    waiting: parseInt(waitingTickets.rows[0].count),
    called: parseInt(calledTickets.rows[0].count),
    completed: parseInt(completedTickets.rows[0].count),
    operators: operatorStats.rows.map(row => ({
      username: row.username,
      ticketsServed: parseInt(row.tickets_served),
      avgTime: parseFloat(row.avg_time / 60).toFixed(2),
    })),
  };
}

module.exports = statisticsController;