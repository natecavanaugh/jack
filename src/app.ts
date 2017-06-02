import { ChildProcess } from 'child_process';

import { getCommitElement } from './interface/commit-view';
import { getHelpPrompt } from './interface/help-prompt';
import { getCommitListElement } from './interface/list-view';
import { getNotificationContainer, notify } from './interface/notification';
import { constructProgressText, getProgressIndicator } from './interface/progress-indicator';
import { getScreen } from './interface/screen';
import { addCommits, notificationSent } from './redux/action-creators';
import { store } from './redux/store';
import {
	BlessedElement,
	BoxElement,
	IListElement,
	IState,
	Screen,
	ScrollableTextElement,
	TextElement,
} from './types/types';
import {
	getCommitContentSync,
	getGitLogProcess,
} from './util/git-util';

export function run(args: string[]): void {
	store.subscribe(renderScreen(getScreen()));

	const gitLogProcess: ChildProcess = getGitLogProcess(args);

	gitLogProcess.stdout.setEncoding('utf8');
	gitLogProcess.stdout.on('data', (data: string) => store.dispatch(addCommits(dataString.split('\n'))));
}

function renderScreen(screen: Screen): () => Screen {
	let lastState: IState = store.getState();

	const commitContentMap: Map<string, string> = new Map();

	let commit: ScrollableTextElement;
	let commitList: IListElement;
	let helpPrompt: TextElement;
	let notificationContainer: BoxElement;
	let progressBar: TextElement;

	return (): Screen => {
		const state: IState = store.getState();

		const {commits, index, SHA, view} = state;

		const lastView = lastState.view;

		const isNewView: boolean = view !== lastView;
		const isNewIndex: boolean = index !== lastState.index;
		const isNewCommits: boolean = commits !== lastState.commits;

		/*

		Create elements if they don't exist

		*/

		if (!commit) {
			commit = getCommitElement();

			screen.append(commit);
		}

		if (!commitList) {
			commitList = getCommitListElement();

			screen.append(commitList);
		}

		if (!helpPrompt) {
			helpPrompt = getHelpPrompt();

			screen.append(helpPrompt);
		}

		if (!progressBar) {
			progressBar = getProgressIndicator(
				constructProgressText(index, commits.length));

			screen.append(progressBar);
		}

		if (!notificationContainer) {
			notificationContainer = getNotificationContainer();

			screen.append(notificationContainer);
		}

		/*

		UI update conditions

		*/

		if (state.notificationType !== 'NONE') {
			notify(state.notificationText, state.notificationType);

			store.dispatch(notificationSent());
		}

		if (isNewCommits) {
			commitList.setItems(commits);
		}

		if (isNewCommits || isNewIndex) {
			progressBar.setText(constructProgressText(index, commits.length));

			commitList.select(index);
		}

		if (view === 'LIST' && isNewView) {
			swapViews(commit, commitList);

			commitList.select(index);
		}

		if (view === 'COMMIT') {
			if (isNewView) {
				swapViews(commitList, commit);
			}

			if (isNewView || isNewIndex) {
				let content: string | undefined = commitContentMap.get(SHA);

				if (!content) {
					content = getCommitContentSync(SHA);

					commitContentMap.set(SHA, content);
				}

				commit.setContent(content);
			}
		}

		screen.render();

		lastState = state;

		return screen;
	};
}

function swapViews(oldViewElement: BlessedElement, newViewElement: BlessedElement) {
	oldViewElement.hide();

	newViewElement.show();
	newViewElement.focus();
}
