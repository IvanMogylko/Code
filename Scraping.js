const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const app = express();

const { userDataStore } = require('./dataStore');

router.post('/scrape', async(req, res) => {
    const userData = userDataStore; // Доступ к сохраненным данным
    // console.log("Используемые данные пользователя:", userData.password, userData.email);

    try {
      const browser = await puppeteer.launch({ headless: false });;
      const page = await browser.newPage();

      await page.goto('https://eduvulcan.pl/logowanie');

      await page.evaluate(() => {
          return new Promise(resolve => {
              setTimeout(resolve, 1500); // Задержка на 3 секунды
          });
      });

      const frames = page.frames();

      const popupFrame = frames.find(frame => frame.name() === 'respect-privacy-frame'); // Замени на URL или ключевое слово iframe

      if (popupFrame) {
          // Ждем появления кнопки принятия условий в iframe
          await popupFrame.waitForSelector('#save-default-button', { visible: true });
          // Кликаем по кнопке принятия условий
          await popupFrame.click('#save-default-button');
      } else {
          console.log("Iframe not found");
      }


      await page.type('#Alias', userData.email);
      // await page.evaluate(b => b.click('#btNext'));
      await page.waitForSelector('#btNext', { visible: true });
      await page.click('#btNext');

      await page.waitForSelector('#Password', { visible: true });
      await page.type('#Password', userData.password);

      await page.click('#btLogOn');
      await page.waitForNavigation();

      // Ожидание появления элемента с помощью CSS-селектора
      await page.waitForSelector('#main_layout > div > div.part-constant > div.part-constant-content > div:nth-child(1) > div > div > div.access-list.mt-5 > div > a');

      // Нахождение элемента с помощью CSS-селектора
      const button = await page.$('#main_layout > div > div.part-constant > div.part-constant-content > div:nth-child(1) > div > div > div.access-list.mt-5 > div > a');

      // Получение атрибута href (ссылки)
      const goToAcc = await page.evaluate(el => el.href, button);

      // Переход по ссылке
      await page.goto(goToAcc, { timeout: 60000, waitUntil: 'domcontentloaded' });





      await page.waitForSelector('#root > div > div > main > header > div > div > div.header__hamburger__icon > button', { visible: true });
      await page.click('#root > div > div > main > header > div > div > div.header__hamburger__icon > button');

      await page.waitForSelector('#root > div > div > aside > section > nav > ul > li.MuiListItem-root.oceny.MuiListItem-gutters', { visible: true });
      await page.click('#root > div > div > aside > section > nav > ul > li.MuiListItem-root.oceny.MuiListItem-gutters');








      //переменные для селекторов
      let subject = 1;

      let DATA = [];


      while (true) {
          try {
              let SubName = {};
              let weight_and_grade = 1;
              // Формируем селекторы для текущего элемента
              let subject_selector = `#panel-content-36902 > div > div.mobile__frame > div > article:nth-child(${subject}) > h2 > div > button > span.MuiIconButton-label > svg > path`;

              let name_selector = `#panel-content-36902 > div > div.mobile__frame > div > article:nth-child(${subject}) > h2 > div > span`

              await page.evaluate(() => {
                  return new Promise(resolve => {
                      setTimeout(resolve, 1000); // Задержка на 1.2 секунды
                  });
              });


              await page.waitForSelector(name_selector, { visible: true, timeout: 2500 });
              const sub = await page.evaluate(el => el.textContent, await page.$(name_selector));
              //console.log("Предмет:", sub);
              SubName.sub = sub; // Записываем название предмета
              SubName.grades = [];

              // Ожидаем появления subject_selector с таймаутом
              await page.waitForSelector(subject_selector, { visible: true, timeout: 2500 });
              
              await page.evaluate(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, subject_selector);

              await page.evaluate(() => {
                return new Promise(resolve => {
                    setTimeout(resolve, 1000); // Задержка на 1.2 секунды
            });
            });

              await page.click(subject_selector, { delay: 100 });



              const rowCount = await page.$$eval('body > div:nth-child(4) > div.MuiPaper-root.MuiDrawer-paper.MuiDrawer-paperAnchorRight.MuiPaper-elevation16 > div > section > div > div.p-datatable.p-component.modal__grades__grid.border-b-1.table-component--hover > div > table > tbody > tr', rows => rows.length);

              while (weight_and_grade <= rowCount) {
                  // Ожидаем появления окна и элемента с весом
                  try {
                      let weight_selector = `body > div:nth-child(4) > div.MuiPaper-root.MuiDrawer-paper.MuiDrawer-paperAnchorRight.MuiPaper-elevation16 > div > section > div > div.p-datatable.p-component.modal__grades__grid.border-b-1.table-component--hover > div > table > tbody > tr:nth-child(${weight_and_grade}) > td.numbers.grade__weight`;
                      let grade_selector = `body > div:nth-child(4) > div.MuiPaper-root.MuiDrawer-paper.MuiDrawer-paperAnchorRight.MuiPaper-elevation16 > div > section > div > div.p-datatable.p-component.modal__grades__grid.border-b-1.table-component--hover > div > table > tbody > tr:nth-child(${weight_and_grade}) > td:nth-child(5) > button > span.MuiButton-label > span`;


                      await page.waitForSelector(grade_selector, { visible: true, timeout: 1000 });
                      // Получаем информацию по весу и оценке
                      let grade = await page.evaluate(el => el.innerText, await page.$(grade_selector));

                      await page.waitForSelector(weight_selector, { visible: true, timeout: 1000 });
                      let weight = await page.evaluate(el => el.innerText, await page.$(weight_selector));

                      SubName.grades.push({
                          grade: grade,
                          weight: weight,
                      });

                      weight_and_grade++;

                      //console.log("Оценка:", grade);
                      //console.log("вага:", weight);


                  } catch (error) {



                      //console.log("Элементы закончились или произошла ошибка:", weight_and_grade, ":", error.message);

                      break; // Останавливаем цикл при ошибке
                  }


              };

              await page.waitForSelector('body > div:nth-child(4) > div.MuiPaper-root.MuiDrawer-paper.MuiDrawer-paperAnchorRight.MuiPaper-elevation16 > div > header > div > button', { visible: true, timeout: 3000 })
              await page.click('body > div:nth-child(4) > div.MuiPaper-root.MuiDrawer-paper.MuiDrawer-paperAnchorRight.MuiPaper-elevation16 > div > header > div > button');

              subject += 1;

              DATA.push(SubName);

          } catch (error) {
              console.log("Элементы закончились или произошла ошибка:", error.message);
              break; // Останавливаем цикл при ошибке
          }
      }



      //console.log(JSON.stringify(DATA, null, 2)); // Вывод данных с форматированием


      await browser.close();
   





      res.json({ DATA });
  } catch (error) {
      console.error('Error during scraping:', error.message);
      res.status(500).json({ error: 'Error during scraping', details: error.message });
  }

});

module.exports = router;