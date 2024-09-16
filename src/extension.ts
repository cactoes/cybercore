import * as vscode from 'vscode';
import { SECOND, timer } from "./timer";
import { file_info } from './file_info';

const file_info_instance = new file_info();
const timer_instance = new timer();

export function activate(context: vscode.ExtensionContext) {
	file_info_instance.start();
	timer_instance.start(1 * SECOND);
}

export function deactivate() {}