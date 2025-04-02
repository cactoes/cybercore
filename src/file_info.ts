import * as vscode from 'vscode';

export class file_info {
    private status_bar_item: vscode.StatusBarItem;

    constructor() {
        this.status_bar_item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, Number.MIN_SAFE_INTEGER);
        this.status_bar_item.tooltip = "(sel) ln:col";

        vscode.window.onDidChangeTextEditorSelection(event => {
            console.log(event);
            this.update();
        });
    }

    public start(): void {
        this.init();
        this.update();
    }

    private set_visibility(show: boolean): void {
        if (show)
            this.status_bar_item.show();
        else
            this.status_bar_item.hide();
    }

    private update(): void {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const { indentSize: indent_size, tabSize: tab_size } = editor.options;
            const indent_type = editor.options.insertSpaces ? `${tab_size}s` : `${tab_size}t`;
            const { line, character } = editor.selection.active;
            const eol = vscode.EndOfLine[editor.document.eol].toString();
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            const text_length_string = text.length > 0 ? `(${text.length}) ` : ``;

            this.status_bar_item.text = `${text_length_string}${line}:${character}`;
        } else {
            this.status_bar_item.text = "n/a";
        }
    }

    private init(): void {
        this.set_visibility(true);
    }
}