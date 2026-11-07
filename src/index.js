#!/usr/bin/env node
/**
 * @file index.js
 * @description Ponto de entrada principal do HabitFlow.
 */

import { CLI } from './presentation/cli.js';

const args = process.argv.slice(2);
const cli = new CLI();
cli.run(args);
