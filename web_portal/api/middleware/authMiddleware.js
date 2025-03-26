const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    logger.error('Token topilmadi', { method: req.method, url: req.url });
    return res.status(401).json({ message: 'Token topilmadi' });
  }

  try {
    const decoded = jwt.verify(token, req.app.locals.SECRET_KEY);
    req.user = decoded;

    if (req.params.orgId && parseInt(req.params.orgId) !== decoded.orgId) {
      logger.error('Tashkilot ruxsati yo‘q', { userId: decoded.id, orgId: decoded.orgId, requestedOrgId: req.params.orgId });
      return res.status(403).json({ message: 'Bu tashkilotga ruxsat yo‘q' });
    }

    logger.action(decoded.id, `${req.method} ${req.url}`, { body: req.body });
    next();
  } catch (error) {
    logger.error('Token tekshiruv xatosi', error);
    res.status(401).json({ message: 'Yaroqsiz token' });
  }
};