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
	import { Loading } from 'sheodox-ui';
	import type { UserStats } from '../shared/types/app';

	let stats: Promise<UserStats>;
	const refreshStats = () => (stats = fetch('/user/full-stats').then((res) => res.json()));
	refreshStats();
</script>
