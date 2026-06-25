try {
  const l = await import('lunar-javascript');
  console.log('installed');
  console.log('Lunar keys:', Object.keys(l).slice(0,5));
} catch(e) {
  console.log('missing:', e.message);
}
