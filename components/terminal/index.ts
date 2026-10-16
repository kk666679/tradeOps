export { default as Terminal } from './Terminal';
export { default as TerminalBody } from './TerminalBody';
export { default as TerminalHeader } from './TerminalHeader';
export { default as TerminalPrompt } from './TerminalPrompt';
export { default as TerminalSuggestions } from './TerminalSuggestions';
export { default as TerminalLine } from './TerminalLine';

export {
  COMMANDS,
  COMMAND_INDEX,
  resolveCommand,
  commandsByGroup,
  workflowCommands,
  declarationCommands,
  graphCommands,
  integrationCommands,
  utilCommands,
} from './commands';

export {
  useHistory,
  useAutocomplete,
  useFocusOnClick,
  useStickyScroll,
  useConsoleCommands,
  type HistoryApi,
  type AutocompleteApi,
} from './hooks';

export {
  newLineId,
  formatTime,
  tokenize,
  inferKind,
  table,
  padEnd,
  padStart,
  joinArgs,
  errorMessage,
  historyAt,
  toLine,
} from './utils';

export {
  LINE_TEXT,
  LINE_MARK,
  PROMPT_SIGIL,
  HISTORY_LIMIT,
  DEFAULT_GREETING,
  ASCII_BANNER,
  SHELL_HEADER,
} from './constants';

export type {
  CommandGroup,
  LineKind,
  TerminalLine as TerminalLineModel,
  CommandOutput,
  CommandSpec,
  TerminalContext,
  TerminalProps,
} from './types';
