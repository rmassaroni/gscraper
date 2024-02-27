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

        const pinnedRepos = await page.$$eval(".pinned-item-list-item", repos => {
            const data = [];
            repos.forEach(repo => {
                const name = repo.querySelector('span.repo').innerText.trim();
                const url = repo.querySelector('a.text-bold').getAttribute('href');
                data.push({ name, url });
            });
            return data;
        });

        console.log('Pinned repositorie:', pinnedRepos);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
        console.log("Success");
    }
}

main();
