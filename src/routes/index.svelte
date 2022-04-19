<script>
	import { onMount } from 'svelte';
	import { APP_HEIGHT } from '$lib/stores/shared';
	import { selectedLanguage } from '$lib/stores/shared';
	import { languageNameTranslations } from '$lib/stores/languages';
	import MapChoropleth from '$lib/components/MapChoropleth.svelte';
	import Select from 'svelte-select';

	let heading;
	let subheading;
	let tooltipLabel1;
	let tooltipLabel2;
	let legendLabel1;
	let legendLabel2;
	let textSourceDescription;
	let textSource;
	let textDataAccess;
	let linkDataAccess;
	let textNoteDescription;
	let textNote;

	// Send map height to parent window
	$: {
		if ($APP_HEIGHT) {
			window.parent.postMessage({ height: $APP_HEIGHT }, '*');
		}
	}

	$: dropdownLanguages = languageNameTranslations[$selectedLanguage.value];

	onMount(async () => {
		await getLanguage($selectedLanguage.value);
	});

	async function getLanguage(lang) {
		const res = await fetch(`/languages/${lang}.json`)
			.then((response) => response.json())
			.then(function (data) {
				heading = data.heading;
				subheading = data.subheading;
				legendLabel1 = data.legend1;
				legendLabel2 = data.legend2;
				tooltipLabel1 = data.tooltip1;
				tooltipLabel2 = data.tooltip2;
				textSourceDescription = data.textSourceDescription;
				textSource = data.textSource;
				textDataAccess = data.textDataAccess;
				linkDataAccess = data.linkDataAccess;
				textNoteDescription = data.textNoteDescription;
				textNote = data.textNote;
			});
	}

	$: legend = [{ label: legendLabel1, color: '#f4f4f4' }];
	$: tooltip = { label1: tooltipLabel1, label2: tooltipLabel2 };

	function handleSelect(event) {
		$selectedLanguage = { value: event.detail.value, label: event.detail.label };
		// $selectedLanguage = event.detail.value;
		getLanguage($selectedLanguage.value);
	}
</script>

<div id="euranet-map" bind:clientHeight={$APP_HEIGHT}>
	<header>
		<div class="logo">
			<img
				src="./img/logo.png"
				srcset="./img/logo.png 1x, ./img/logo@2x.png 2x"
				alt="Logo EuraNet"
			/>
		</div>
		<div class="select">
			<Select
				items={dropdownLanguages}
				value={$selectedLanguage}
				placeholder="Select a language …"
				noOptionsMessage="No language found"
				on:select={handleSelect}
			/>
		</div>
	</header>
	<div id="chart" class="mt-8">
		{#if heading && subheading}
			<div id="chart-header">
				<h1 class="text-xl font-bold">{heading}</h1>
				<h3 class="text-md">{subheading}</h3>
			</div>
		{/if}

		<div id="chart-body" class="mt-4">
			<MapChoropleth {legend} {tooltip} />
		</div>
	</div>
	{#if textSourceDescription && textSource && textDataAccess}
		<div class="text-xs mt-2">
			<div>
				<span class="font-bold">{textSourceDescription}:</span>
				{textSource}
			</div>
			<div>
				<span class="font-bold">{textNoteDescription}: </span><span>{textNote}</span>
			</div>
			<div class="underline">
				<a target="_blank" href={linkDataAccess}>{textDataAccess}</a>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(body) {
		margin: 0;
		text-align: center;
		font-family: Arial, Helvetica, sans-serif;
		color: #2b3163;
	}

	header {
		display: flex;
		align-items: center;
	}

	.logo {
		flex: 1;
	}

	.select {
		flex: 1;
	}

	div {
		text-align: left;
	}
</style>
