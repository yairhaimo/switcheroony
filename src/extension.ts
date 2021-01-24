import * as vscode from 'vscode';
import * as path from 'path';
import * as codeint from '@code-int/analytics';
const memoize = require('lodash.memoize');

const getFileToOpen = memoize(
	async (dirName: string, patterns: RegExp[]) => {
		const files = (await vscode.workspace.fs.readDirectory(vscode.Uri.file(dirName))).map((file) => file[0]);
		return findFileByPatternPriority(files, patterns);
	},
	(...args: any[]) => args.join('@')
);

function getCurrentDirName() {
	const filePath = vscode.window.activeTextEditor?.document.fileName;
	if (filePath) {
		return path.dirname(filePath);
	}
}

async function openTestFile() {
	openFile([/(?:test|spec)/]);
}

async function openDriverFile() {
	openFile([/driver/]);
}

async function openStyleFile() {
	openFile([/\.(?:sass|scss|css|less)/]);
}

async function openImplFile() {
	const dirName = getCurrentDirName();
	if (dirName) {
		const dirNameRegex = new RegExp(`${dirName.split('/').slice(-1)[0]}(?:\.comp)?\.[jt]sx?`, 'i');
		openFile([dirNameRegex, /index\.[jt]sx?/]);
	}
}

function findFileByPatternPriority(files: string[], patterns: RegExp[]) {
	console.log(`***files`, files);
	for (let pattern of patterns) {
		for (let fileName of files) {
			console.log(`***fileName`, fileName, pattern, pattern.test(fileName));
			if (pattern.test(fileName)) {
				return fileName;
			}
		}
	}
}

async function openFile(patterns: RegExp[]) {
	const dirName = getCurrentDirName();
	if (dirName) {
		const fileName = await getFileToOpen(dirName, patterns);
		if (fileName) {
			console.log(`***opening fileName`, `${dirName}/${fileName}`);
			const doc = await vscode.workspace.openTextDocument(`${dirName}/${fileName}`);
			vscode.window.showTextDocument(doc, { preview: true, preserveFocus: false });
		}
	}
}

export function activate(context: vscode.ExtensionContext) {
	codeint.init('6933510f-7c3e-4f19-941b-8756ad505d69', context);
	const testDisposable = codeint.registerCommand('extension.switcheroonyToTest', async () => {
		await openTestFile();
	});
	context.subscriptions.push(testDisposable);
	const prodDisposable = codeint.registerCommand('extension.switcheroonyToImplementation', async () => {
		await openImplFile();
	});
	context.subscriptions.push(prodDisposable);
	const driverDisposable = codeint.registerCommand('extension.switcheroonyToDriver', async () => {
		await openDriverFile();
	});
	context.subscriptions.push(driverDisposable);
	const styleDisposable = codeint.registerCommand('extension.switcheroonyToStyle', async () => {
		await openStyleFile();
	});
	context.subscriptions.push(styleDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
