<style>
	th,
	td {
		padding: 0.5rem;
	}
</style>

<div class="modal-body">
	{#await stats}
		<Loading />
	{:then stats}
		{#if $phraseStore && $phraseStore.length > 0}
			<button on:click={copyPhrases}>
				<Icon icon="copy" /> Copy active phrases to clipboard
			</button>
			<button on:click={deleteAllPhrases} class="danger">
				<Icon icon="trash" />
				Delete all active phrases
			</button>
		{/if}

		<table>
			<tbody>
				<tr>
					<th scope="row">Active Phrases</th>
					<td>{stats.activePhrases}</td>
				</tr>
				<tr>
					<th scope="row">Deleted Phrases</th>
					<td>{stats.deletedPhrases}</td>
				</tr>
				<tr>
					<th scope="row">Total Phrases</th>
					<td>{stats.totalPhrases}</td>
				</tr>
				<tr>
					<th scope="row">User Since</th>
					<td>{new Date(stats.userCreatedAt).toLocaleDateString()}</td>
				</tr>
			</tbody>
		</table>
	{/await}
</div>

<script lang="ts">
	import { Icon, Loading, createAutoExpireToast } from 'sheodox-ui';
	import phraseStore from './stores/phrases';
	import { copyToClipboard } from './utils';
	import type { UserStats } from '../shared/types/app';

	let stats: Promise<UserStats>;
	const refreshStats = () => (stats = fetch('/user/full-stats').then((res) => res.json()));
	refreshStats();

	function phraseCount(num: number) {
		return `${num} phrase${num === 1 ? '' : 's'}`;
	}

	function copyPhrases() {
		copyToClipboard($phraseStore.map(({ phrase }) => phrase).join('\n'));
		createAutoExpireToast({
			title: 'Copied',
			message: `${phraseCount($phraseStore.length)} have been copied.`,
		});
	}

	async function deleteAllPhrases() {
		if (!confirm(`Are you sure you want to delete all ${phraseCount($phraseStore.length)}?`)) {
			return;
		}

		await phraseStore.remove($phraseStore.map(({ id }) => id));
		refreshStats();
	}
</script>
