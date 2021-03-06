import * as Blessed from 'blessed';

export type BlessedElement = Blessed.Widgets.BlessedElement;
export type BoxElement = Blessed.Widgets.BoxElement;
export type BoxOptions = Blessed.Widgets.BoxOptions;
export type KeyEvent = Blessed.Widgets.Events.IKeyEventArg;
export type ListElementStyle = Blessed.Widgets.ListElementStyle;
export type ListOptions = Blessed.Widgets.ListOptions<ListElementStyle>;
export type Node = Blessed.Widgets.Node;
export type Screen = Blessed.Widgets.Screen;
export type ScreenOptions = Blessed.Widgets.IScreenOptions;
export type ScrollableTextElement = Blessed.Widgets.ScrollableTextElement;
export type ScrollableTextOptions = Blessed.Widgets.ScrollableTextOptions;
export type TextElement = Blessed.Widgets.TextElement;
export type TextOptions = Blessed.Widgets.TextOptions;

export interface IListElement extends Blessed.Widgets.ListElement {
	selected?: number;

	enterSelected?(): void;
	pushItem(child: BlessedElement | string): number;
	setItems(items: BlessedElement[] | string[]): void;
}

export type View = 'COMMIT' | 'LIST';

export type ActionType =
	'ADD_COMMITS' |
	'DECREMENT_INDEX' |
	'INCREMENT_INDEX' |
	'NEXT_COMMIT' |
	'NOTIFICATION_REQUESTED' |
	'NOTIFICATION_SENT' |
	'PREVIOUS_COMMIT' |
	'VIEW_COMMIT' |
	'VIEW_LIST';

export type NotificationType =
	'ERROR' |
	'INFO' |
	'NONE' |
	'SUCCESS' |
	'WARNING';

export interface IState {
	view: View;
	split: boolean;
	index: number;
	commits: string[];
	content: string;
	SHA: string;
	notificationText: string;
	notificationType: NotificationType;
}

export interface IAction {
	type: ActionType;
	payload?: any;
}
