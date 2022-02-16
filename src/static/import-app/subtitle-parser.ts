// parse subript and webvtt subtitles and return phrases
export function parseSubrip(subrip: string) {
	return (
		subrip
			//get rid of the carriage return in windows style line endings, it's easier to parse with just \n characters
			.replace(/\r\n/g, '\n')
			//some subtitle files that have been seen for some reason only use carriage returns and no newline characters
			//but it seems those carriage returns are used in the same place as i'd expect newline characters to be,
			//if there are remaining carriage returns in the subtitle script after accounting for windows style line endings
			//by now we assume it's this strange case we're dealing with, just normalize them into newlines
			.replace(/\r/g, '\n')
			//two lines separate each subtitle line
			.split('\n\n')
			// each block is made up of several lines
			.map((block) => {
				const lines = block.split('\n');

				//subrip files will number each subtitle, we don't care about those lines, make it look more like webvtt
				if (/^\d+$/.test(lines[0])) {
					lines.shift();
				}
				return lines;
			})
			.filter((lines) => {
				// we might still have non-subtitle lines, (like the WEBVTT header or NOTES lines),
				// filter to groups of lines that have timing data on them.
				// subrip times have a comma decimal delimiter
				// subrip ex: 00:03:18,608 --> 00:03:20,371
				// webvtt ex: 00:00:17.168 --> 00:00:19.170
				// note we're not checking if the line ends after the timings as webvtt can have styling cues there
				return /^[\d:.,]*\s*-->\s*[\d:.,]*/.test(lines[0].trim());
			})
			.map((lines) => {
				// now that we should only have subtitles, we can discard the timing data
				lines.shift();

				return (
					lines
						// the remaining subtitles should just be 1-2 lines of text, put them back together
						.join('')
						//https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API#cue_payload_text_tags
						//there are some tags (for styling or karaoke) that can be present in webvtt,
						//they look like html, strip anything that looks like that as it's generally a
						//presentation hint only.
						.replace(/<.*?>/g, '')
				);
			})
	);
}

export function parseASS(ass: string) {
	//much easier to parse without carriage returns, keep in mind though that \\r is a 'reset' override tag
	ass = ass.replace(/\r\n/g, '\n');

	// ASS subtitles have several blocks of stuff for metadata and styling, we only care about the subtitles block
	const blocks = ass.split('\n\n'),
		// each block starts with a name in brackets, find the [Events] one which is where subtitles are
		eventsBlock = blocks.find((block) => block.startsWith('[Events]\n')),
		// split into lines of subtitles, ignoring any lines that aren't "Dialogue" lines (comments, format)
		subtitleLines = eventsBlock.split('\n').filter((line) => line.startsWith('Dialogue:')),
		subtitles = subtitleLines.map((line) => {
			// subtitle lines are kind of like a CSV. a bunch of styling information is separated by commas,
			// and after the last csv column is the subtitle itself, commas are allowed there and aren't
			// treated as column delimiters
			return (
				line
					.split(',')
					.slice(9)
					.join(',')
					// \N in ASS is a hard newline, just turn it into a space for now
					.replace(/\\N/g, ' ')
					// \h in ASS is a hard space, we don't need those, it's for visual alignment and stuff
					.replace(/\\h/g, '')
					// if a drawing override tag like \p1 is found, blank out the entire line, as the "text" of the
					// subtitle will be a drawing command, which is just a bunch of vector path commands, no readable text here
					.replace(/.*\\p[\d+].*/, '')
					// individual subtitles can have override tags, which are kind of like inline styling that can change
					// a lot of stuff about that subtitle in particular, strip those out.
					.replace(/\{.*?\}/g, '')
			);
		});

	// filter out anything that didn't have readable text (like drawing commands)
	return subtitles.filter((subtitle) => !!subtitle);
}
