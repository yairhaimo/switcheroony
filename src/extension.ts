import * as vscode from 'vscode';
import * as path from 'path';

const memoize = require('lodash.memoize');

const getFileToOpen = memoize(
	async (dirName: string, patterns: RegExp[]) => {
		const files = (await vscode.workspace.fs.readDirectory(vscode.Uri.file(dirName))).map(
			(file) => file[0]
		);
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
	const conf = vscode.workspace.getConfiguration('switcheroony');
	console.log(`***conf`, conf);

	['One', 'Two', 'Three', 'Four'].forEach((num) => {
		context.subscriptions.push(
			vscode.commands.registerCommand(`extension.switcheroony${num}`, async () => {
				await openFile([new RegExp(conf[num.toLowerCase()].pattern)]);
			})
		);
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}
