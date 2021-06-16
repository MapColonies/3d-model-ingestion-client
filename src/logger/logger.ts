/*eslint-disable */
import { MCLogger } from '@map-colonies/mc-logger';
const { name, version } = require('../../package.json');
const LOGGER = (window as any)._env_.LOGGER;

const logger : MCLogger = new MCLogger(LOGGER, { name, version });

export default logger;
