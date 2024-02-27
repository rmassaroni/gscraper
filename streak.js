const playwright = require('playwright');

const username = 'rmassaroni';
const url = `https://github.com/${username}`;

async function main() {
    const browser = await playwright.chromium.launch({
        headless: false
    });

    const page = await browser.newPage();

    try {
        await page.goto(url);

        await page.waitForSelector('.ContributionCalendar-day');


// Extract contribution data for each day
        const contributionData = await page.$$eval('.ContributionCalendar-day', days => {
            return days.map(day => {
                const date = day.getAttribute('data-date');
                const level = parseInt(day.getAttribute('data-level'));
                return { date, level };
            });
        });

        // Find today's date
        const currentDate = new Date().toLocaleDateString();

        // Count the streak backward from today's date
        let streakLength = 0;
        for (const day of contributionData) {
            if (day.date === currentDate && day.level > 0) {
                streakLength++;
            } else if (streakLength > 0 && day.level > 0) {
                streakLength++;
            } else {
                break;
            }
        }
        console.log(currentDate);
        console.log('Contribution streak as of ${currentDate}:', streakLength);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
        console.log("Success");
    }
}

main();
