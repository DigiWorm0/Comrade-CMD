export enum LogLevel {
    Success,
    Info,
    Warn,
    Error,
}

export default interface LogMessage {
    timestamp: number,
    level: LogLevel;
    text: string;
}