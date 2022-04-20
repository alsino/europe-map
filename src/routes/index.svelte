<script>
	import { config } from '$lib/stores/config';
	import { onMount } from 'svelte';
	import { APP_HEIGHT } from '$lib/stores/config';
	import { selectedLanguage } from '$lib/stores/config';
	import { languageNameTranslations } from '$lib/stores/languages';
	import MapChoropleth from '$lib/components/MapChoropleth.svelte';
	import Select from 'svelte-select';

	let heading;
	let subheading;
	let legend;
	let legendEntries;
	let tooltipLabel1;
	let tooltipLabel2;
	let textSourceDescription;
	let textSource;
	let textDataAccess;
	let linkDataAccess;
	let textNoteDescription;
	let textNote;

	$: console.log(config);

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
				tooltipLabel1 = data.tooltip1;
				tooltipLabel2 = data.tooltip2;
				textSourceDescription = data.textSourceDescription;
				textSource = data.textSource;
				textDataAccess = data.textDataAccess;
				linkDataAccess = data.linkDataAccess;
				textNoteDescription = data.textNoteDescription;
				textNote = data.textNote;

				// Filter all keys with text "legend"
				legendEntries = Object.keys(data).filter((item) => {
					return item.includes('legend');
				});

				// For each "legend" entry create object with value and color
				legend = legendEntries.map((item) => {
					return {
						[item]: data[item],
						label: data[item],
						color: config[`${item}Color`]
					};
				});
				// console.log(legend);
			});
	}

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
		<div id="chart-header">
			{#if config.headlineAvailable && heading}<h1 class="text-xl font-bold">{heading}</h1>{/if}
			{#if config.subheadlineAvailable && subheading}<h3 class="text-md">{subheading}</h3>{/if}
		</div>
		<div id="chart-body" class="mt-4">
			<MapChoropleth {legend} {tooltip} />
		</div>
	</div>
	<div class="text-xs mt-2">
		{#if config.textSourceAvailable && textSourceDescription && textSource}
			<div>
				<span class="font-bold">{textSourceDescription}: </span><span>{textSource}</span>
			</div>
		{/if}
		{#if config.textNoteAvailable && textNoteDescription && textNote}
			<div>
				<span class="font-bold">{textNoteDescription}: </span><span>{textNote}</span>
			</div>
		{/if}
		{#if config.textDataAccessAvailable && linkDataAccess && textDataAccess}
			<div class="underline">
				<a target="_blank" href={linkDataAccess}>{textDataAccess}</a>
			</div>
		{/if}
	</div>
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
