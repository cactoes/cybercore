import * as vscode from 'vscode';

export const SECOND = 1000;

const styles = [ "normal", "full" ] as const;
type styles_t = typeof styles[number];
const formators = [
    (time: number): string => {
        const date = new Date(time);

        let hrs: number = date.getHours() - 1;
        let min: number = date.getMinutes();
        let sec: number = date.getSeconds();

        let full_time = `${sec}s`;

        if (min > 0 || hrs > 0)
            full_time = `${min}m ${full_time}`;

        if (hrs > 0)
            full_time = `${hrs}h ${full_time}`;

        return full_time;
    },
    (time: number): string => {
        const date = new Date(time);

        let hrs: number = date.getHours() - 1;
        let min: number = date.getMinutes();
        let sec: number = date.getSeconds();

        return `${hrs < 10 ? "0" : ""}${hrs}:` +
               `${min < 10 ? "0" : ""}${min}:` +
               `${sec < 10 ? "0" : ""}${sec}`;
    }
];

export class timer {
    private status_bar_item: vscode.StatusBarItem;
    private start_time: number = 0;
    private loop: NodeJS.Timer | undefined;
    private style_format_selector: number = 0;
    private config: vscode.WorkspaceConfiguration;

    constructor() {
        this.status_bar_item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, Number.MIN_SAFE_INTEGER);
        this.status_bar_item.tooltip = "in session";
        this.status_bar_item.command = "cybercore.changeTimerStyle";
        this.config = vscode.workspace.getConfiguration("cybercore");
        
        vscode.workspace.onDidChangeConfiguration(event => {
            this.config = vscode.workspace.getConfiguration("cybercore");
            this.set_visibility(this.config.get<boolean>("timerShow") ?? true);
            this.set_format(this.config.get<styles_t>("timerStyle") ?? "normal");
            this.update();
        });

        vscode.commands.registerCommand("cybercore.changeTimerStyle", () => {
            this.style_format_selector++;
            this.config.update("timerStyle", styles.at(this.style_format_selector % styles.length), vscode.ConfigurationTarget.Global);
            this.update();
        });

        vscode.commands.registerCommand("cybercore.toggleTimerVisibility", () => {
            let current = this.config.get<boolean>("timerShow") ?? true;
            this.set_visibility(!current);
            this.config.update("timerShow", !current, vscode.ConfigurationTarget.Global);
            this.update();
        });
    }

    public start(interval: number): void {
        this.init();
        this.loop = setInterval(() => this.update(), interval);
    }

    private set_visibility(show: boolean): void {
        if (show)
            this.status_bar_item.show();
        else
            this.status_bar_item.hide();
    }

    private set_format(style: styles_t): void {
        this.style_format_selector = styles.indexOf(style);
    }

    private update(): void {
        this.status_bar_item.text = formators[this.style_format_selector % formators.length](this.get_time());
    }

    private get_time(): number {
        return Date.now() - this.start_time;
    }

    private init(): void {
        this.start_time = Date.now();
        this.set_format(this.config.get<styles_t>("timerStyle") ?? "normal");
        this.set_visibility(this.config.get<boolean>("timerShow") ?? true);
        this.update();
    }
}