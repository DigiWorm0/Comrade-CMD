import { Intent } from "@blueprintjs/core";
import { LogLevel } from "../types/LogMessage";

const _LogLevelToIntent = {
    [LogLevel.Success]: Intent.SUCCESS,
    [LogLevel.Info]: Intent.PRIMARY,
    [LogLevel.Warn]: Intent.WARNING,
    [LogLevel.Error]: Intent.DANGER,
}

export default function LogLevelToIntent(type: LogLevel): Intent {
    return _LogLevelToIntent[type];
}